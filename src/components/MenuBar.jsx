import React from 'react';
import { loginStatus } from '../App';
import '../styles/general/MenuBar.css';
import InlineTag from './InlineTag';

const logo_img = require('../assets/logo_v6_square.png');
const hamburger_menu_threshold = 1300;
const links = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Contribute',
    url: '/contribute'
  },
  {
    name: 'CanvasEarth',
    url: '/canvasearth'
  },
  {
    name: 'About',
    url: '/about'
  },
  {
    name: 'Spotlight',
    url: '/spotlight'
  },
  {
    name: 'Predictions',
    url: '/predictions'
  },
];

export function logOut() {
  localStorage.removeItem('displayName');
  localStorage.removeItem('username');
  localStorage.removeItem('avatarRef');

  // Send logout request to server. It should clear the cookie that stores the JWT token
  fetch('https://floracosm-server.azurewebsites.net/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // console.log('logout response:', data);
    window.location.href = '/?loggedOut=true';
  })
}

/**
 * Props: (all optional)
 * - fade: boolean, whether or not to fade the menu bar from transparent to opaque
 * - selected: string, the name of the selected page, used to highlight the selected page in the menu bar
 * - displayName: string, the display name of the user, used to display the user's name in the menu bar
 */
const MenuBar = (props) => {

  // If logged in, this is stored in localStorage
  const userDisplayName = loginStatus() && localStorage.getItem('displayName');

  const menuBarRef = React.useRef(null);
  const burgerListRef = React.useRef(null);
  
  const [useBurger, setUseBurger] = React.useState(window.innerWidth <= hamburger_menu_threshold);
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false);

  React.useEffect(() => {

    const handleResize = () => {
      if (window.innerWidth <= hamburger_menu_threshold && !useBurger) {
        setUseBurger(true);
      } else if (window.innerWidth > hamburger_menu_threshold && useBurger) {
        setUseBurger(false);
        setHamburgerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    if (!loginStatus()) {
      localStorage.removeItem('displayName');
      localStorage.removeItem('username');
      localStorage.removeItem('avatarRef');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [useBurger]);

  // Make menubar transparent at top, then should be 100% opacity when scrolled down 100vh
  // unless hamburger open, then stay dark
  React.useEffect(() => {
    if (menuBarRef.current === null) return;
    const menuBar = menuBarRef.current;
    if (!props.fade) {
      menuBar.style.backgroundColor = 'rgb(16, 16, 17)';
      return;
    }

    // recalculate opacity on hamburger closing
    // hamburgerOpen at this point should be the current state
    // thus, if it is now false that means burger is closed and we should recalculate opacity
    if (!hamburgerOpen) {
      menuBar.style.backgroundColor = `rgba(16, 16, 17, ${Math.min(window.scrollY / window.innerHeight, 1)})`;
    }

    const handleScroll = () => {
      if (hamburgerOpen) return;
      menuBar.style.backgroundColor = `rgba(16, 16, 17, ${Math.min(window.scrollY / window.innerHeight, 1)})`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll) };
  }, [hamburgerOpen, props.fade]);

  return (
    window.innerWidth > hamburger_menu_threshold?
      /* Regular menu bar */
      <header className='menu-bar noburger' ref={menuBarRef}>
        
        <a href='/' className='menu-logo'>
          <img src={logo_img} alt='logo' className='menu-logo-img' />
          Floracosm {['CanvasEarth', 'Spotlight', 'Predictions'].includes(props.selected) &&
            <div className='menu-logo-locdescriptor'>{props.selected}</div>}
        </a>

        <nav className='menu-middle'>

          {links.map((link, index) => {

            // spotlight and predictions are dimmed
            if ([4, 5].includes(index)) {
              return (
                <span
                key={index} 
                className='menu-link-indev'>
                  {link.name}
                </span>
              );
            }

            return (
              <a 
              href={link.url} 
              key={index} 
              className={`hover-underline-2px menu-link ${(props.selected === link.name)? 'hover-underline-selected' : ''}`}>
                {link.name}
              </a>
            );
          })}

        </nav>

        <div className='menu-right'>
          {loginStatus()?
            <div className='menu-right-loggedin'>
              <a href='/account' className='menu-right-account-link'>
                {userDisplayName || props.displayName}
              </a>
              <button className='button-danger button-medium min-width-max-content' onClick={() => logOut()}>Log out</button>
            </div> :

            <div className='flex-row flex-gap-10px align-center'>
              <a href='/account/login' className='text-decoration-none text-black'>
                <button className='button-secondary-dark button-medium'>Log in</button>
              </a>
              <a href='/account/register' className='text-decoration-none text-black'>
                <button className='button-primary button-medium'>Create Account</button>
              </a>
            </div>}
        </div>

      </header> :

      /* Hamburger menu bar */
      <header className='menu-bar yesburger' ref={menuBarRef} style={{backgroundColor: hamburgerOpen? 'rgb(16, 16, 17)' : null}}>

        <a href='/' className='menu-logo-hamburger'>
          <img src={logo_img} alt='logo' className='menu-logo-img-hamburger' />
          <span className='menu-logo-vanishable-name'>Floracosm</span>
          {['CanvasEarth', 'Spotlight', 'Predictions'].includes(props.selected) &&
            <div className='menu-logo-locdescriptor-burger'>{props.selected}</div>}
        </a>

        <div 
        className='hamburger-icon-container'
        style={{backgroundColor: hamburgerOpen? '#8884' : null}}
        onClick={() => setHamburgerOpen(!hamburgerOpen)}>

          <img src={hamburgerOpen? require('../assets/icons/close.png') : require('../assets/icons/menu_burger.png')} alt='menu' className='hamburger-icon-img' />

        </div>

        <div ref={burgerListRef} className='hamburger-menu-list' style={{display: hamburgerOpen? 'flex' : 'none'}}>
          
          <div className='hml-mainitem-container'>

            <div className='hml-mainitem hml-green_aqua' onClick={() => window.location.href = '/canvasearth'}>
              <div className='hml-mainitem-title'>
                <img className='hml-mainitem-img' src={require('../assets/icons/color_grid.png')} alt='canvasearth' />
                CanvasEarth
              </div>
              <p className='hml-desc'>
                A giant map you can contribute images to by donating! The size of your picture scales with donation amount.
              </p>
            </div>

            <div className='hml-mainitem-indev hml-yellow_red-grayed' /*onClick={() => window.location.href = '/spotlight'}*/>
              <div className='hml-mainitem-title'>
                <img className='hml-mainitem-img' src={require('../assets/icons/stage.png')} alt='spotlight' />
                Spotlight
              </div>
              <InlineTag style={{margin: 0}} text='Coming Soon' color='#b0d' backgroundColor='#fdff' borderColor='#b0d' fontSize={12} />
              <p className='hml-desc'>
                Bid against others for air time on a global stream! Display any video or image for everyone else to see!
              </p>
            </div>

            <div className='hml-mainitem-indev hml-blue_magenta-grayed' /*onClick={() => window.location.href = '/predictions'}*/>
              <div className='hml-mainitem-title'>
                <img className='hml-mainitem-img' src={require('../assets/icons/hourglass.png')} alt='predictions' />
                Predictions
              </div>
              <InlineTag style={{margin: 0}} text='Planned' color='#b30' backgroundColor='#fdcf' borderColor='#b30' fontSize={12} />
              <p className='hml-desc'>
              Contribute to predict the future, or show everyone just how much better you think cats are than dogs!
              </p>
            </div>

          </div>

          {links.filter(link => (
            link.name !== 'CanvasEarth' && 
            link.name !== 'Predictions' && 
            link.name !== 'Spotlight'
            )).map((link, index) => {

            return (
              <a href={link.url} key={index}>
                {link.name}
              </a>
            )
            
          })}

          {loginStatus()?
            <>
              <a href='/account'>Account</a>
              <div className='hml-logout-button-container'>
                <button className='width-100 button-danger button-medium font-size-18px' onClick={() => logOut()}>Log out</button>
              </div>
            </> :
            <>
              <a href='/account/login'>Log In</a>
              <a href='/account/register'>Create Account</a>
            </>
          }

        </div>

      </header>
  );
};

export default MenuBar;