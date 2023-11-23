import React from 'react';
import '../styles/contribute/ContributeAgreements.css';
import SwitchOption from './SwitchOption';

/**
 * 
 * @param {Object} agreements
 * @param {Function} setAgreements
 * @param {Array} innerFontSizes [heading, desc]
 * @returns 
 */
const ContributeAgreements = ({ agreements, setAgreements, innerFontSizes }) => {
  return (
    <div className='contribute-agreements-container'>
      <div className='main-agreements'>
        <SwitchOption
        directive="
          I certify that my submission satisfies the
          &nbsp;<a href='/about/rules' target='_blank' class='link'>Community Guidelines</a>."
        desc="I understand that my submission may be removed without compensation if the CanvasEarth moderators find the post to be in violation of this agreement."
        outerStyle={{ padding: '8px 12px' }}
        directiveStyle={{ fontSize: innerFontSizes? innerFontSizes[0] : 14 }}
        descStyle={{ fontSize: innerFontSizes? innerFontSizes[1] : 12 }}
        selected={agreements.guidelines}
        toggleSelected={() => setAgreements({ ...agreements, guidelines: !agreements.guidelines })} />

        <SwitchOption
        directive="
          I have read and agree to the
          &nbsp;<a href='/about/terms' target='_blank' class='link'>Terms and Conditions</a> and
          &nbsp;<a href='/about/privacy' target='_blank' class='link'>Privacy Policy</a>."
        outerStyle={{ padding: '8px 12px' }}
        directiveStyle={{ fontSize: innerFontSizes? innerFontSizes[0] : 14 }}
        descStyle={{ fontSize: innerFontSizes? innerFontSizes[1] : 12 }}
        selected={agreements.terms}
        toggleSelected={() => setAgreements({ ...agreements, terms: !agreements.terms })} 
        />

        <SwitchOption
        directive="
          I understand that this contribution is generally nonrefundable and uneditable."
        desc="In extreme cases, <a href='/about#contact' target='_blank' class='link'>contact us</a> to request a refund or edit. Note that not all requests will be accepted."
        outerStyle={{ padding: '8px 12px' }}
        directiveStyle={{ fontSize: innerFontSizes? innerFontSizes[0] : 14 }}
        descStyle={{ fontSize: innerFontSizes? innerFontSizes[1] : 12 }}
        selected={agreements.nonrefund}
        toggleSelected={() => setAgreements({ ...agreements, nonrefund: !agreements.nonrefund })} />
      </div>
    </div>
  );
};

export default ContributeAgreements;