import React from 'react';

const SECTIONS = [
  {
    title: 'Collection of your Personal Information',
    body: [
      `Liberty Ordnance Supply may collect personally identifiable information, including your first and last name, e-mail address, and phone number.`,
      `For purchases, billing and credit card information are collected to complete transactions. Anonymous demographic information such as age may also be gathered.`,
      `Personal information is only collected when voluntarily provided, though it may be required for: registering for an account; entering sweepstakes; signing up for special offers; sending email messages; or submitting payment information.`
    ]
  },
  {
    title: 'Use of your Personal Information',
    body: [`Liberty Ordnance Supply collects and uses personal information to operate and deliver requested services. The company may also use your information to inform you of other products or services available from Liberty Ordnance Supply and its affiliates.`]
  },
  {
    title: 'Sharing Information with Third Parties',
    body: [
      `Liberty Ordnance Supply does not sell, rent or lease its customer lists to third parties. The company may share data with trusted partners for statistical analysis, email, postal mail, customer support, or delivery arrangements. All third parties are prohibited from using personal information except to provide these services and must maintain confidentiality.`,
      `Personal information may be disclosed without notice if required by law or to protect rights, property, or public safety.`
    ]
  },
  {
    title: 'Tracking User Behavior',
    body: [`Liberty Ordnance Supply tracks websites and pages users visit to determine popular services. This data delivers customized content and advertising to customers based on indicated interests.`]
  },
  {
    title: 'Automatically Collected Information',
    body: [`Information about computer hardware and software may be automatically collected, including IP address, browser type, domain names, access times, and referring website addresses. This information maintains service quality and provides general usage statistics.`]
  },
  {
    title: 'Use of Cookies',
    body: [
      `The Liberty Ordnance Supply website may use "cookies" to help you personalize your online experience. A cookie is a text file placed on your hard disk by a web page server. Cookies cannot run programs or deliver viruses.`,
      `Cookies save time by recalling specific information on subsequent visits, such as billing and shipping addresses. You can accept or decline cookies through browser settings, though declining may limit interactive features.`
    ]
  },
  {
    title: 'Links',
    body: [`This website contains links to other sites. Liberty Ordnance Supply is not responsible for the content or privacy practices of such other sites.`]
  },
  {
    title: 'Security of your Personal Information',
    body: [
      `Liberty Ordnance Supply secures personal information using SSL (Secure Sockets Layer) Protocol encryption when transmitting sensitive data like credit card numbers.`,
      `However, no data transmission over the Internet or any wireless network can be guaranteed to be 100% secure. Users acknowledge that security and privacy limitations inherent to the Internet are beyond the company's control.`
    ]
  },
  {
    title: 'Rights to Deletion',
    body: [
      `Upon receipt of a verifiable request, Liberty Ordnance Supply will delete personal information from its records and direct service providers to do the same.`,
      `Exceptions exist if deletion would: prevent completion of transactions or product recalls; disable security incident detection or fraud prosecution; impair debugging of errors; interfere with free speech rights; violate the California Electronic Communications Privacy Act; compromise scientific research; conflict with lawful internal uses aligned with customer expectations; or breach existing legal obligations.`
    ]
  },
  {
    title: 'Children under Thirteen',
    body: [`Liberty Ordnance Supply does not knowingly collect personally identifiable information from children under the age of thirteen. Users under thirteen must obtain parental permission.`]
  },
  {
    title: 'E-mail Communications',
    body: [`Liberty Ordnance Supply may contact you via email for announcements, promotional offers, alerts, confirmations, and surveys. You can opt out by clicking the unsubscribe link in any such email.`]
  },
  {
    title: 'External Data Storage Sites',
    body: [`Data may be stored on servers provided by third-party hosting vendors.`]
  },
  {
    title: 'Changes to this Statement',
    body: [`Liberty Ordnance Supply reserves the right to modify this Privacy Policy. Significant changes will be communicated via email, prominent website notice, or privacy information updates. Continued use constitutes acknowledgment and agreement to the modified policy.`]
  }
];

export default function PrivacyPolicy() {
  return (
    <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0', maxWidth: '860px', marginLeft: 'auto', marginRight: 'auto' }}>
      <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>Legal</p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.02em', margin: '10px 0 0' }}>Privacy Policy</h1>
      <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: '16px 0 0' }}>
        Protecting your private information is our priority. This Statement of Privacy applies to libertyordnancesupply.com and Liberty Ordnance Supply and governs data collection and usage. By using the Liberty Ordnance Supply website, you consent to the data practices described in this statement.
      </p>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '10px 0 0' }}>Effective as of September 20, 2023</p>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {SECTIONS.map(s => (
          <section key={s.title}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: '0 0 10px' }}>{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: i === 0 ? 0 : '12px 0 0' }}>{p}</p>
            ))}
          </section>
        ))}

        <section style={{ borderTop: '2px solid var(--color-divider)', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: '0 0 10px' }}>Contact Information</h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, margin: 0 }}>
            Liberty Ordnance Supply<br />
            2000 Main St, Unit 9a<br />
            Walpole, Massachusetts 02081
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '12px 0 0' }}>
            Email: <a href="mailto:sales@los2a.com" style={{ color: 'var(--color-accent)' }}>sales@los2a.com</a><br />
            Phone: <a href="tel:+15084925955" style={{ color: 'var(--color-accent)' }}>508-492-5955</a>
          </p>
        </section>
      </div>
    </main>
  );
}
