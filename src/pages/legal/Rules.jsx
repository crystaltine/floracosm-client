import React from 'react';
import '../../styles/about/Legal.css';
import MenuBar from '../../components/MenuBar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

document.title = 'Rules | Floracosm';

const sections = [
	{display: 'Be a good person', sectionID: 'r1'},
	{display: 'Respect privacy', sectionID: 'r2'},
	{display: 'Don\'t attack the website', sectionID: 'r3'},
	{display: 'Don\'t violate copyright', sectionID: 'r4'},
];

const Rules = () => {

  return (
    <div className='generic-page-body-expandable'>

			<MenuBar selected='About' />

			<div className='legal-page-body'>

				<Sidebar outerClassList='legal-sidebar' innerClassList='legal-sidebar-inner' sections={sections} />

				<div className='legal-content' style={{lineHeight: 1.5}}>

					<a class='display-block font-size-16px' href='/home'>&larr; Home</a>
					<rulestitle><strong>Community Guidelines</strong></rulestitle>

					<br /><br />

					<section id='r1'>
						<h1>1. We're all here for a good cause. You should be a good person.</h1>
						<p>
							This is an online community for people who want to help solve an issue that affects all of us. Please don't use this platform to dehumanize or attack others.
							Do not submit to CanvasEarth or Spotlight content that is
							<ul>
								<li>Illegal or blatantly promoting illegal or prohibited activity;</li>
								<li>Overly threatening, harassing, or abusive;</li>
								<li>Excessively offensive, graphic, or violent</li>
								<li>Sexually explicit or otherwise inappropriate scenes involving minors;</li>
							</ul>
						</p>
					</section>

					<br /><br />
					
					<section id='r2'>
						<h1>2. Respect the privacy of yourself and others.</h1>
						<p>
							Refrain from posting any personal information about yourself. It is recommended that you do not include things like your email address, phone number, full name, birthdate, or any other information that could be used by malicious actors to target you. We may remove posts that contain such information for your personal safety.
							<br /><br />
							On the other side, do not post personal information on other people. This includes, but is not limited to, their address, name, email address, phone number, name, birthdate, and any information that is not publicly visible or that you do not have explicit permission to share. These violations are highly likely to be removed and reimbursement will not be provided.
						</p>
					</section>

					<br /><br />

					<section id='r3'>
						<h1>3. Do not intentionally try to attack the website.</h1>
						<p>
							Please report any bugs or issues you find <a href='/about#contact'>here</a>. There's really no point in abusing any glitches you find; at the end of the day, this is a platform for donations, not a bank. There isn't much to gain if you're not contributing genuinely.
						</p>
					</section>

					<section id='r4'>
						<h1>4. Do not violate copyright laws.</h1>
						<p>
							Do not post content to CanvasEarth that you do have sufficient rights to distribute. If you're thinking about somehow submitting the entirety of <i>Harry Potter</i> (somehow), don't. Content that violates this rule will be immediately removed and you will not be reimbursed.
						</p>
					</section>

				</div>

			</div>

			<Footer />

		</div>
  );
};

export default Rules;