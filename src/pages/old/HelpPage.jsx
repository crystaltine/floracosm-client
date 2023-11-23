import React from 'react';
import '../styles/help/HelpPage.css';
import MenuBar from '../../components/MenuBar';
import FaqDropdown from '../../components/FaqDropdown';

const topicOptions = [
  { value: 'site_bug_report', label: 'Site Bug Report' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'account_issue', label: 'Account Issue' },
  { value: 'billing_issue', label: 'Billing Issue' },
  { value: 'submission_issue', label: 'Submission Issue' },
  { value: 'other', label: 'Other' }
]

const FAQContent = require('../../static/FAQs.json')

const HelpPage = () => {
  return (
    <div className='generic-page-body'>
      <MenuBar selected='Help' />
			<div className='help-page-content'>

        <section className='faq-section'>
          <h1 className='help-page-header'>
            Frequently Asked Questions
          </h1>
          <div className='faq-container'>
          {FAQContent &&
            FAQContent.map((faq) => (
              <FaqDropdown question={faq.question} answer={faq.answer} />
            ))
          }
          </div>
        </section>
        
        <section className='contact-section'>
          <h1 className='help-page-header'>Need Specific Help?</h1>
          <form className='contact-form'>

          <div>
            <div className='minilabel'>Topic</div>
            
            <form className='topic-selector'>

              {topicOptions.map((topic) => (
                <div className='topic-option'>
                  <input type='radio' id={topic.value} name='topic' value={topic.value} />
                  <label for={topic.value}>{topic.label}</label>
                </div>
              ))}

            </form>

            </div>

            <div>
            <div className='minilabel'>Email</div>
            <input className='input-bordered-bottom' type='text' />
            </div>

            <div>
            <div className='minilabel'>Subject</div>
            <input className='input-bordered-bottom' type='text' />
            </div>

            <div>
            <div className='minilabel'>Message</div>
            <textarea className='textarea-light-border' type='text' />
            </div>

            <button className='submit-button'>Submit</button>

          </form>
        </section>
			</div>
    </div>
  );
};

export default HelpPage;