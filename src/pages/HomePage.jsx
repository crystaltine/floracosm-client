import React from 'react';
import '../styles/general/prebuilt.css'
import '../styles/home/HomePage.css'
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer';
import HomepageSitelink from '../components/home/HomepageSitelink';
import InlineTag from '../components/InlineTag';

const HomePage = (props) => {

  document.title = 'Floracosm';

  // Get stats from server @/site-stats
  const [stats, setStats] = React.useState({})

  React.useEffect(() => {
    fetch('https://floracosm-server.azurewebsites.net/site-stats')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.success) {
          console.log('Error getting site stats')
          return
        }
        setStats(data.data)
      })
      .catch(err => console.log(err))
  }, []);

  return (
    <div className='generic-page-body height-fit-content'>

      <MenuBar fade selected='Home' />

      <div className='homepage-bg'>
        <div className='htc'>

          <h1 className='homepage-title'>
            Reimagining Climate Fundraising
          </h1>
          <p className='homepage-subtitle'>
            There is no way to bring our world together than through the internet. Inspired by the&nbsp;
            <a className='link' href='http://www.milliondollarhomepage.com/' target='_blank' rel='noopener noreferrer'>Million Dollar Homepage</a>
            &nbsp;and <a className='link' href='https://teamtrees.org/' target='_blank' rel='noopener noreferrer'>TeamTrees</a>,
            Floracosm is a collection of web platforms that aims to make giving money away more rewarding and collaborative.
          </p>

          <div className='htc-sitelinks'>
            <HomepageSitelink 
            imgRef={require('../assets/icons/color_grid.png')}
            link='/canvasearth'
            title='CANVASEARTH'
            desc='A giant map you can contribute images to by donating! The size of your picture scales with donation amount.'
            color="#6b95c1" />

            <HomepageSitelink 
            imgRef={require('../assets/icons/stage.png')}
            link=''
            title='SPOTLIGHT'
            desc='Bid against others for air time on a global stream! Display any video or image for everyone else to see!'
            color="#ca5818" />  

            <HomepageSitelink 
            imgRef={require('../assets/icons/hourglass.png')}
            link=''
            title='PREDICTIONS'
            desc='Contribute to predict the future, or show everyone just how much better you think cats are than dogs!'
            color="#57a13c" />

          </div>

          <div className='htc-lookbelow'>
            Scroll Down for More Info! &darr;
          </div>

        </div>
      </div>
      
      <section aria-label='content' className='homepage-content'>

        <section id='intro' className='homepage-section-panel hc-padding'>

          <div className='homepage-panel-text hpt-border-y'>

            <hr className='hpt-border-y-topline' />

            <div className='homepage-section-heading'>
              Giving Each Contribution a Visible Impact.
            </div>
            
            <h2 className='homepage-section-subheading'>
              Floracosm is an online platform with the goal of leveraging creativity to create an incentive to donate.
              <br /><br />
              Our mission is to give your donation a visible and enjoyable impact, rather than having it just disappear into thin air. No one donation will change the world, but together, change <b>can</b> be made. 
              <br /><br />
              We can all be part of the solution.
              <br /><br />

              <div className='flex-row flex-gap-20px flex-wrap'>
                <a className='link' href='/account/register'>
                  <button className='button-primary button-medium'>Create an Account</button>
                </a>
                <a className='link' href='/canvasearth'>
                  <button className='button-secondary button-medium'>Explore CanvasEarth</button>
                </a>
              </div>
            </h2>

            <hr className='hpt-border-y-bottomline' />

          </div>

          <div className='homepage-image-container'>
            <img src={require('../assets/homepage/image_panel.png')} alt='panel' className='homepage-section-img' />
          </div>
          
        </section>

        <section id='stats' className='homepage-section-generic hc-padding'>

          <div className='homepage-section-heading hsh-lined --hchc-blue_magenta'>
            <h1 className='hch-text'>
              Statistics
            </h1>
          </div>

          <div className='stats-container'>

            <div className='stat-box --sb-magenta'>
              <div className='stat-box-value'>
                {stats.totalDonated ? `$${stats.totalDonated.toLocaleString()}` : '~'}
              </div>
              <h1 className='stat-box-title'>
                Total Raised
              </h1>
            </div>

            <div className='stat-box --sb-red'>
              <div className='stat-box-value'>
                {stats.numSubmissions? `${stats.numSubmissions.toLocaleString()}` : '~'}
              </div>
              <h1 className='stat-box-title'>
                CanvasEarth Submissions
              </h1>
            </div>

            <div className='stat-box --sb-orange'>
              <div className='stat-box-value'>
                {stats.spotlightViewers ? `${stats.spotlightViewers.toLocaleString()}` : '~'}
              </div>
              <h1 className='stat-box-title'>
                Spotlight Viewers
              </h1>
            </div>

            <div className='stat-box --sb-yellow'>
              <div className='stat-box-value'>
                {stats.numUsers ? `${stats.numUsers.toLocaleString()}` : '~'}
              </div>
              <h1 className='stat-box-title'>
                Registered Users
              </h1>
            </div>

          </div>
        </section>

        <section id='projects' className='homepage-section-generic hc-padding'>

          <div className='homepage-section-heading hsh-lined --hchc-aqua_green'>
            <h1 className='hch-text'>
              Projects
            </h1>
          </div>

          <div className='homepage-projects-container'>
            
            <div className='homepage-project-card'>
              <div>
                <h1 className='hpc-name'>
                  CanvasEarth
                </h1>
                <p className='hpc-desc'>
                  Submit your favorite images or photos and share your story with the world!
                  Donate as little as $1 and become a part of this year's project.
                  <br /><br />
                  Yes, that's right: each year has a different map. At the end of the year, the canvas is archived and a new one is created. You'll always be able to see your past contributions, but old maps can no longer be added to. <b>Even a dollar a year makes a difference!</b>
                </p>
                
              </div>
              <a className='margin-top-auto' href='/canvasearth'>
                <button className='button-primary button-medium'>Go to CanvasEarth</button>
              </a>
            </div>

            <div className='homepage-project-card'>
              <div>
                <h1 className='hpc-name'>
                  Spotlight <InlineTag text='Coming Soon' color='#c1c' backgroundColor='#c0f2' borderColor='#c1c' fontSize={12} />
                </h1>
                <p className='hpc-desc'>
                  One stream slot. Every day, three bids are held, and the winner of each is given a thirty-minute time interval to share a video, image, Youtube link, or Twitch stream with everyone watching!
                  <br /><br />
                  A global chat is available for more fun. Please refer to the <a className='link' href='/about/rules'>Community Guidelines</a> for content and chat rules. Know that there is moderation for disallowed content.
                </p>
              </div>
              <button disabled className='margin-top-auto width-fit-content button-primary button-medium'>Watch Spotlight</button>
            </div>

            <div className='homepage-project-card'>
              <div>
                <h1 className='hpc-name'>
                  Predictions&nbsp;<InlineTag text='Planned' fontSize={12} />
                </h1>
                <p className='hpc-desc'>
                  Weekly polls and predictions held for everyone to participate in. Predictions could be for any length, from a day to a decade! Donate to show the world that Cats are better than Dogs, or to bet on tomorrow's weather!
                  <br /><br />
                  Predictions will be verified when time's up. Both predictions and polls will always have two options.
                </p>
              </div>
              <button disabled className='margin-top-auto width-fit-content button-primary button-medium'>Explore Predictions</button>
            </div>

          </div>

        </section>

        <img src={require('../assets/homepage/homepage_cta_squares.png')} alt='squares' className='homepage-middle-img' />

        <section id='2050' className='homepage-section-generic'>

          <div className='hc-padding'>
            <div className='homepage-section-heading hsh-lined --hchc-yellow_red'>
              <h1 className='hch-text'>
                Getting to Net-Zero
              </h1>
            </div>
          </div>

          <div className='--2050-cta hc-padding'>
            <h1 className='homepage-text-h1'>Goal set for 2050. How Close are we?</h1>
            <p className='homepage-text-p'>
              In 2015, the Paris Agreement was signed by 196 countries. A goal was set to reach net-zero emissions by 2050.
              To be clear, net-zero does not necessarily require the complete elimination of emissions. 
              The emissions we do produce must be offset by an equal amount of carbon capture or removal.

              <br /><br />
            </p>

            <h2 className='homepage-text-h2'>
              So, how much progress have we made since then?
            </h2>

            <p className='homepage-text-p'>
              Not much. In fact, we've actually increased our emissions since 2015. And this is just carbon dioxide.
              Climate change is about <b>all</b> greenhouse gases; it's about the impacts these emissions have on the environment around us.
              Global warming is only one part of the problem - but it can be a start to finding our way out.
              <br /><br />
              What are we waiting for? 2050 is only a few decades away, and well, we've got a lot of work to do.  
            </p>

            <iframe 
            title='Global Emissions' 
            src="https://ourworldindata.org/grapher/annual-co2-emissions-per-country?country=~OWID_WRL" 
            loading="lazy" 
            style={{
              width: '100%', 
              margin: '20px 0px',
              height: '600px', 
              borderRadius: '8px',
              border: '0px none'}} />

          </div>

        </section>
        
        <img className='homepage-bottom-img' src={require('../assets/homepage/homepage-bottom.png')} alt='footer-i' />

      </section>

      <Footer />

    </div>
  );
};

export default HomePage;