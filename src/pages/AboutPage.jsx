import React from 'react';
import '../styles/about/AboutPage.css';
import '../styles/general/prebuilt.css';
import FaqDropdown from '../components/FaqDropdown';
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer';
const validator = require('email-validator');

const topicOptions = [
  { value: 'site_bug_report', label: 'Site Bug Report' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'account_issue', label: 'Account Issue' },
  { value: 'billing_issue', label: 'Billing Issue' },
  { value: 'submission_issue', label: 'Submission Issue' },
  { value: 'other', label: 'Other' }
]
const FAQContent = require('../static/FAQs.json')

const AboutPage = () => {

  document.title = 'About | Floracosm';

  const [contactDetails, setContactDetails] = React.useState({
    topic: '',
    email: '',
    subject: '',
    message: ''
  });

  // Used for submit feedback (e.g. error, success)
  const [message, setMessage] = React.useState('')
  const [isMessageSuccess, setIsMessageSuccess] = React.useState(false);

  const submitContactForm = React.useCallback(() => {

    // Ensure all fields are filled out
    if (!contactDetails.topic || !contactDetails.email || !contactDetails.subject || !contactDetails.message) {
      setMessage('Make sure to fill in all fields!')
      setIsMessageSuccess(false)
      return
    }

    // Check for valid email
    if (!validator.validate(contactDetails.email)) {
      setMessage('Please enter a valid email!')
      setIsMessageSuccess(false)
      return
    }

    fetch(`https://floracosm-server.azurewebsites.net/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactDetails)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setMessage('Successfully sent message! Thanks!')
        setIsMessageSuccess(true)
        setContactDetails({
          topic: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setMessage(data.message || 'Yikes, something broke. Hopefully this gets fixed soon!')
        setIsMessageSuccess(false)
      }
    })
  }, [contactDetails])

  return (
    <div className='generic-page-body'>

      <MenuBar selected='About' />

      <div className='about-page-topbg' />

      <div className='about-page-content'>
        
        <div aria-label='main-about' className='about-left-content'>
          <section id='about' aria-label='about' className='about-section'>
            <div className='position-relative margin-bottom-15px hsh-lined --hchc-blue_magenta'>
              <h1>About Floracosm</h1>
            </div>
            <h2>Incentive</h2>
            <p>
              You might care about the future of our planet. But are you actually involved enough to give away your hard-earned money? For some of you, probably not... You might not feel like you're able to make a dent. There just isn't much incentive to get up and do something about global warming. You want me to give away cash? In this economy?
              <br /><br />
              Floracosm is a collection of individually developed web platforms intended to bring a little more involvement to our collective fight against climate change. Our goal is to give every donation a lasting mark, one that you and the world can see and remember.
            </p>

            <h2>What you Contribute to</h2>
            <h3>Climate Solution Research</h3>
            <p>
              Volunteering is cool. Recycling is cool. Electric cars are cool. But none of those will actually solve climate change. The biggest problem inherently lies in how our society works. The modern world needs a LOT of energy to function, but currently the easiest, cheapest, and most developed method of obtaining that energy is through fossil fuels. Clean energy is not yet ready to replace fossil fuels simply because of how expensive it is and how much energy we need. The world needs more efficient methods of harnessing the sources of clean energy provided by nature.
              <br /><br />
              By donating the money we raise to research, we help to find ways to make clean energy more accessible and applicable. This way, it becomes a more attractive option to industries and businesses, and gradually, fossil fuels can be replaced in a move toward the net-zero and beyond world we need.
            </p>

            <h2>CanvasEarth</h2>
            <p>
              The idea that started this project! When you donate through CanvasEarth, you are allowed to upload a photo to this year's global canvas. The more you donate, the larger your image scales - from 1x1 grid cells at $1 up to 10x10 grid cells for giant donations. The canvas itself scales as images near the edge - it will always be 10 units outward from the furthest images on each side.
              <br /><br />
              Each canvas lasts for one year. On the first day of the new year, the previous canvas is archived and can no longer be added to. You can view previous years' images by using the slider on the top left of the <a href='/canvas' target='_blank' rel='noopener noreferrer' className='link'>CanvasEarth</a> page. 
              <br /><br />
              So get that one dollar in before the end of the year! Share with your friends and put your photos next to each other! There is so much power for change that lies dormant on the Internet; your part lets us make a huge impact together.
            </p>

            <h2>Spotlight</h2>
            <p>
              A project in the works! Built upon the idea of sharing a video or stream with the world. Some details are still being worked out, but the idea is the winner of an auction is able to share an upload, Youtube video, or live Twitch stream to all viewers on the site. Join on the spotlight page to talk in a global chat room! Remember, this project is not completed yet, but it will be soon!
            </p>

            <h2>Predictions</h2>
            <p>
              The newest idea of the three. Predictions allows you to donate toward one choice or another in a global poll or prediction. We will try to create predictions as objectively as possible, and streaks will be counted for correct guesses. Likewise, donate to your favorite side of the poll to show your support and maybe gain an infinitesimal amount of Internet bragging rights when it wins.
            </p>

            <h2>Developer</h2>
            <p>
              Website and ideas by <a href='https://github.com/crystaltine' target='_blank' className='link' rel="noreferrer">crystaltine</a> ♥
              <br />
              My real name is Michael, and I'm a high school senior from Washington state. I learned HTML from <a href='https://www.youtube.com/watch?v=G3e-cpL7ofc' target='_blank' rel='noopener noreferrer'>this awesome video</a> back in February 2023 and just went absolutely crazy with making websites.
              I'm not really kidding when I say that one video opened an entire world for me. All I could do before that was print numbers to the console and make plugins in Minecraft, but websites are accessible by anyone, and aren't just files stored on my computer. That's what truly excited me - being able to share the things I made.
              <br /><br />
              So yeah, constantly experimenting and playing around with different ideas eventually led up to this project! This is my first attempt at semi-professional work, and I hope it is able to find its purpose (also, because I'm still new to this, please report any issues you will undoubtedly find!). Thank you for visiting!
              <br /><br />
              Development started in August 2023.
            </p>
          </section>

          <section id='faq' aria-label='faq' className='faq-section'>
            <div className='position-relative margin-bottom-15px hsh-lined --hchc-aqua_green'>
              <h1>Frequently Asked Questions</h1>
            </div>
            <div className='faq-container'>
            {FAQContent &&
              FAQContent.map((faq) => (
                <FaqDropdown question={faq.question} answer={faq.answer} />
              ))
            }
            </div>
          </section>
        </div>
        
        <div aria-label='side-about' className='about-right-content'>

          <section id='links' aria-label='links'>
            <div className='position-relative margin-bottom-10px hsh-lined-thin --hchc-aqua_green'>
              <h2>Links</h2>
            </div>
            <div className='flex-column flex-gap-10px'> 
              <a href='/about/terms' target='_blank' className='link font-weight-500 font-size-16px'>Terms and Conditions</a>
              <a href='/about/privacy' target='_blank' className='link font-weight-500 font-size-16px'>Privacy Policy</a>
              <a href='/about/rules' target='_blank' className='link font-weight-500 font-size-16px'>Community Guidelines</a>
            </div>
          </section>

          <section id='contact' aria-label='contact'>

            <div className='position-relative margin-bottom-20px hsh-lined-thin --hchc-yellow_red'>
              <h2>Contact</h2>
            </div>

            <div className='contact-form'>

              <div>
                <div className='minilabel'>Topic</div>
                
                <form className='topic-selector'>

                  {topicOptions.map((topic) => (
                    <div className='topic-option'>
                      <input 
                      type='radio' 
                      id={topic.value} 
                      checked={contactDetails.topic === topic.value}
                      onClick={() => setContactDetails({ ...contactDetails, topic: topic.value })}
                      name='topic' 
                      value={topic.value} />
                      <label for={topic.value}>{topic.label}</label>
                    </div>
                  ))}

                </form>

              </div>

              <div>
                <div className='minilabel'>Email</div>
                <input 
                type='text' 
                value={contactDetails.email}
                className='input-primary' 
                onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })} />
              </div>

              <div>
                <div className='minilabel'>Subject</div>
                <input 
                type='text' 
                value={contactDetails.subject}
                className='input-primary'
                onChange={(e) => setContactDetails({ ...contactDetails, subject: e.target.value })} />
              </div>

              <div>
                <div className='minilabel'>Message</div>
                <textarea 
                value={contactDetails.message}
                className='textarea-primary'
                onChange={(e) => setContactDetails({ ...contactDetails, message: e.target.value })} />
              </div>

              {message && 
              <div className={`${isMessageSuccess? 'success-message' : 'error-message'}`}>
                {message}
              </div>}

              <button 
              type='button'
              onClick={submitContactForm}
              className='button-primary button-medium width-100'>
                Submit
              </button>

            </div>

          </section>

        </div>
      
      </div>

      <Footer />
    
    </div>
  );
};

export default AboutPage;