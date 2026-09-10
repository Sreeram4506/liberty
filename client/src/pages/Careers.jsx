import React from 'react';

export default function Careers() {
  return (
    <main className="wrap">
      <section style={{ padding: 'clamp(36px,6vw,64px) 0', borderBottom: '2px solid var(--color-divider)' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 16px' }}>LOS careers</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 0 -0.055em' }}>We're growing.<br /><span style={{ color: 'var(--color-accent)' }}>Grow with us.</span></h1>
        <p style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '56ch', margin: '22px 0 0' }}>Apply by submitting a <strong>resume</strong> and <strong>cover letter</strong> to sales@los2a.com with the <strong>job title in the subject line</strong>. Applications are reviewed on a rolling basis.</p>
        <a href="mailto:sales@los2a.com?subject=Application" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '26px', minHeight: '48px' }}>Apply by email</a>
      </section>

      <section style={{ padding: 'clamp(36px,5vw,56px) 0', display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vw,36px)' }}>
        <article style={{ border: '2px solid var(--color-divider)' }}>
          <div style={{ padding: '22px 24px', borderBottom: '2px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'baseline' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(22px,2.6vw,28px)', margin: 0 }}>Part-Time Retail Staff</h2>
            <span className="tag tag-accent">$20&ndash;$25 / hr</span>
          </div>
          <div style={{ padding: '22px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '24px 40px' }}>
            <div>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 8px' }}>Overview</p>
              <p style={{ fontSize: '14.5px', lineHeight: 1.65, margin: 0 }}>Strong knowledge of firearms and a passion for exceptional customer service. Saturday 9:30am&ndash;6:30pm, Sunday 9:30am&ndash;4:00pm. Weekends required &mdash; want more hours? Let's discuss.</p>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '18px 0 0' }}>Benefits</p>
              <ul style={{ margin: '12px 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14.5px', lineHeight: 1.6 }}>
                <li>Dealer cost on almost all items</li>
                <li>Range days with the LOS crew &mdash; training and casual days</li>
                <li>We're moving to a larger building soon. Grow with us!</li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 8px' }}>Responsibilities</p>
              <ul style={{ margin: '0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14.5px', lineHeight: 1.6 }}>
                <li>Operate the POS system and handle transactions with accuracy</li>
                <li>Conduct background checks in compliance with federal and state regulations</li>
                <li>Maintain a professional, organized retail environment</li>
                <li>Assist customers with product inquiries</li>
                <li>Multitask in a dynamic, fast-paced environment</li>
              </ul>
            </div>
          </div>
        </article>

        <article style={{ border: '2px solid var(--color-divider)' }}>
          <div style={{ padding: '22px 24px', borderBottom: '2px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'baseline' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(22px,2.6vw,28px)', margin: 0 }}>Firearms Instructor</h2>
            <span className="tag tag-outline">Flexible scheduling</span>
          </div>
          <div style={{ padding: '22px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '24px 40px' }}>
            <div>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 8px' }}>Overview</p>
              <p style={{ fontSize: '14.5px', lineHeight: 1.65, margin: 0 }}>Help train the community through in-person shooting courses. Certified instructors preferred, but we welcome candidates without certifications to assist with specific courses.</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 8px' }}>Requirements</p>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14.5px', lineHeight: 1.6 }}>
                <li>Proficiency in concealed carry techniques</li>
                <li>Advanced pistol &amp; rifle fundamentals</li>
                <li>Teach shooters of all experience levels with clear, engaging communication</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
