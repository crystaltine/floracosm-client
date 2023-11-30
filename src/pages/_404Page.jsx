import React from 'react';
import '../styles/general/_404Page.css';
import Footer from '../components/Footer';
import MenuBar from '../components/MenuBar';
import { setTabInfo } from '../utils';

const Page404 = () => {

  React.useEffect(() => {
    setTabInfo('404 | Floracosm');
  }, []);

  // future pages are at /spotlight and /predictions
  const isAtFuturePage = window.location.href.endsWith('/spotlight') || window.location.href.endsWith('/predictions');

  return (
    <div className='generic-page-body-expandable'>
      <MenuBar />

      <div className='_404-body-container'>
        <section className='_404-body'>
          <h1>{isAtFuturePage? 'Not Yet! 404!' : '404'}</h1>
          <h2>{isAtFuturePage? 'This project is still in development. Nice Try.' : 'Uh oh, we got lost!'}</h2>
          <p>There is no page at this URL. Who knows? Maybe there will be in the future! For now though, bye!</p>
          <a className='link-invis' href='/'><button className='button-primary button-medium'>Back to Homepage</button></a>
        </section>
        <p className='margin-top-auto margin-bottom-0px padding-0px font-size-10px z-index-12 text-center'>If you're wondering, the background art here was made by AI because I didn't want to draw anything. Thanks Bing!</p>
      </div>

      <Footer />

    </div>
  );
};

export default Page404;