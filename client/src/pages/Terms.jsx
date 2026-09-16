import React from 'react';

const SECTIONS = [
  {
    title: 'Agreement Between User and libertyordnancesupply.com',
    body: [
      `Welcome to libertyordnancesupply.com. The libertyordnancesupply.com website (the "Site") is comprised of various web pages operated by Liberty Ordnance Supply. libertyordnancesupply.com is offered to you conditioned on your acceptance without modification of the terms, conditions, and notices contained herein (the "Terms"). Your use of libertyordnancesupply.com constitutes your agreement to all such Terms. Please read these terms carefully, and keep a copy of them for your reference.`,
      `libertyordnancesupply.com is an E-Commerce Site.`,
      `Liberty Ordnance Supply provides a variety of available firearms-related services, accessories, and apparel.`
    ]
  },
  {
    title: 'Privacy',
    body: [`Your use of libertyordnancesupply.com is subject to Liberty Ordnance Supply's Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.`]
  },
  {
    title: 'Electronic Communications',
    body: [`Visiting libertyordnancesupply.com or sending emails to Liberty Ordnance Supply constitutes electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communications be in writing.`]
  },
  {
    title: 'Your Account',
    body: [`If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity. You acknowledge that Liberty Ordnance Supply is not responsible for third party access to your account that results from theft or misappropriation of your account. Liberty Ordnance Supply and its associates reserve the right to refuse or cancel service, terminate accounts, or remove or edit content in our sole discretion.`]
  },
  {
    title: 'Children Under Thirteen',
    body: [`Liberty Ordnance Supply does not knowingly collect, either online or offline, personal information from persons under the age of thirteen. If you are under 18, you may use libertyordnancesupply.com only with permission of a parent or guardian.`]
  },
  {
    title: 'Cancellation/Refund Policy',
    body: [`Orders are eligible for cancellation within a 1 hour period. Refunds/exchanges may be made at the discretion of Liberty Ordnance Supply on a case-by-case basis.`]
  },
  {
    title: 'Links to Third Party Sites/Third Party Services',
    body: [
      `libertyordnancesupply.com may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of Liberty Ordnance Supply and Liberty Ordnance Supply is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. Liberty Ordnance Supply is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by Liberty Ordnance Supply of the site or any association with its operators.`,
      `Certain services made available via libertyordnancesupply.com are delivered by third party sites and organizations. By using any product, service or functionality originating from the libertyordnancesupply.com domain, you hereby acknowledge and consent that Liberty Ordnance Supply may share such information and data with any third party with whom Liberty Ordnance Supply has a contractual relationship to provide the requested product, service or functionality on behalf of libertyordnancesupply.com users and customers.`
    ]
  },
  {
    title: 'No Unlawful or Prohibited Use/Intellectual Property',
    body: [
      `You are granted a non-exclusive, non-transferable, revocable license to access and use libertyordnancesupply.com strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to Liberty Ordnance Supply that you will not use the Site for any purpose that is unlawful or prohibited by these Terms. You may not use the Site in any manner which could damage, disable, overburden, or impair the Site or interfere with any other party's use and enjoyment of the Site. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Site.`,
      `All content included as part of the Service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site, is the property of Liberty Ordnance Supply or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights. You agree to observe and abide by all copyright and other proprietary notices, legends or other restrictions contained in any such content and will not make any changes thereto.`,
      `You will not modify, publish, transmit, reverse engineer, participate in the transfer or sale, create derivative works, or in any way exploit any of the content, in whole or in part, found on the Site. Liberty Ordnance Supply content is not for resale. Your use of the Site does not entitle you to make any unauthorized use of any protected content, and in particular you will not delete or alter any proprietary rights or attribution notices in any content. You will use protected content solely for your personal use, and will make no other use of the content without the express written permission of Liberty Ordnance Supply and the copyright owner. You agree that you do not acquire any ownership rights in any protected content. We do not grant you any licenses, express or implied, to the intellectual property of Liberty Ordnance Supply or our licensors except as expressly authorized by these Terms.`
    ]
  },
  {
    title: 'International Users',
    body: [`The Service is controlled, operated and administered by Liberty Ordnance Supply from our offices within the USA. If you access the Service from a location outside the USA, you are responsible for compliance with all local laws. You agree that you will not use the Liberty Ordnance Supply Content accessed through libertyordnancesupply.com in any country or in any manner prohibited by any applicable laws, restrictions or regulations.`]
  },
  {
    title: 'Indemnification',
    body: [`You agree to indemnify, defend and hold harmless Liberty Ordnance Supply, its officers, directors, employees, agents and third parties, for any losses, costs, liabilities and expenses (including reasonable attorney's fees) relating to or arising out of your use of or inability to use the Site or services, any user postings made by you, your violation of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable laws, rules or regulations. Liberty Ordnance Supply reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with Liberty Ordnance Supply in asserting any available defenses.`]
  },
  {
    title: 'Arbitration',
    body: [`In the event the parties are not able to resolve any dispute between them arising out of or concerning these Terms and Conditions, or any provisions hereof, whether in contract, tort, or otherwise at law or in equity for damages or any other relief, then such dispute shall be resolved only by final and binding arbitration pursuant to the Federal Arbitration Act, conducted by a single neutral arbitrator and administered by the American Arbitration Association, or a similar arbitration service selected by the parties, in a location mutually agreed upon by the parties. The arbitrator's award shall be final, and judgment may be entered upon it in any court having jurisdiction. In the event that any legal or equitable action, proceeding or arbitration arises out of or concerns these Terms and Conditions, the prevailing party shall be entitled to recover its costs and reasonable attorney's fees. The parties agree to arbitrate all disputes and claims in regards to these Terms and Conditions or any disputes arising as a result of these Terms and Conditions, whether directly or indirectly, including Tort claims that are a result of these Terms and Conditions. The parties agree that the Federal Arbitration Act governs the interpretation and enforcement of this provision. The entire dispute, including the scope and enforceability of this arbitration provision shall be determined by the Arbitrator. This arbitration provision shall survive the termination of these Terms and Conditions.`]
  },
  {
    title: 'Class Action Waiver',
    body: [`Any arbitration under these Terms and Conditions will take place on an individual basis; class arbitrations and class/representative/collective actions are not permitted. THE PARTIES AGREE THAT A PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN EACH'S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PUTATIVE CLASS, COLLECTIVE AND/ OR REPRESENTATIVE PROCEEDING, SUCH AS IN THE FORM OF A PRIVATE ATTORNEY GENERAL ACTION AGAINST THE OTHER. Further, unless both you and Liberty Ordnance Supply agree otherwise, the arbitrator may not consolidate more than one person's claims, and may not otherwise preside over any form of a representative or class proceeding.`]
  },
  {
    title: 'Liability Disclaimer',
    body: [
      `THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. LIBERTY ORDNANCE SUPPLY AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.`,
      `LIBERTY ORDNANCE SUPPLY AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE PROVIDED "AS IS" WITHOUT WARRANTY OR CONDITION OF ANY KIND. LIBERTY ORDNANCE SUPPLY AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.`,
      `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LIBERTY ORDNANCE SUPPLY AND/OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SITE, WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED THROUGH THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE SITE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, EVEN IF LIBERTY ORDNANCE SUPPLY OR ANY OF ITS SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. BECAUSE SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.`
    ]
  },
  {
    title: 'Termination/Access Restriction',
    body: [
      `Liberty Ordnance Supply reserves the right, in its sole discretion, to terminate your access to the Site and the related services or any portion thereof at any time, without notice. To the maximum extent permitted by law, this agreement is governed by the laws of the Commonwealth of Massachusetts and you hereby consent to the exclusive jurisdiction and venue of courts in Massachusetts in all disputes arising out of or relating to the use of the Site. Use of the Site is unauthorized in any jurisdiction that does not give effect to all provisions of these Terms, including, without limitation, this section.`,
      `You agree that no joint venture, partnership, employment, or agency relationship exists between you and Liberty Ordnance Supply as a result of this agreement or use of the Site. Liberty Ordnance Supply's performance of this agreement is subject to existing laws and legal process, and nothing contained in this agreement is in derogation of Liberty Ordnance Supply's right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or information provided to or gathered by Liberty Ordnance Supply with respect to such use. If any part of this agreement is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the agreement shall continue in effect.`,
      `Unless otherwise specified herein, this agreement constitutes the entire agreement between the user and Liberty Ordnance Supply with respect to the Site and it supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written, between the user and Liberty Ordnance Supply with respect to the Site. A printed version of this agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. It is the express wish to the parties that this agreement and all related documents be written in English.`
    ]
  },
  {
    title: 'Changes to Terms',
    body: [`Liberty Ordnance Supply reserves the right, in its sole discretion, to change the Terms under which libertyordnancesupply.com is offered. The most current version of the Terms will supersede all previous versions. Liberty Ordnance Supply encourages you to periodically review the Terms to stay informed of our updates.`]
  }
];

export default function Terms() {
  return (
    <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0', maxWidth: '860px', marginLeft: 'auto', marginRight: 'auto' }}>
      <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>Legal</p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.02em', margin: '10px 0 0' }}>Terms &amp; Conditions</h1>

      <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {SECTIONS.map(s => (
          <section key={s.title}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: '0 0 10px' }}>{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: i === 0 ? 0 : '12px 0 0' }}>{p}</p>
            ))}
          </section>
        ))}

        <section style={{ borderTop: '2px solid var(--color-divider)', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: '0 0 10px' }}>Contact Us</h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0 }}>
            Liberty Ordnance Supply welcomes your questions or comments regarding the Terms:
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '12px 0 0' }}>
            Liberty Ordnance Supply<br />
            2000 Main St, Unit 9a<br />
            Walpole, Massachusetts 02081
          </p>
          <p style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '12px 0 0' }}>
            Email: <a href="mailto:sales@los2a.com" style={{ color: 'var(--color-accent)' }}>sales@los2a.com</a><br />
            Phone: <a href="tel:+15084925855" style={{ color: 'var(--color-accent)' }}>508-492-5855</a>
          </p>
        </section>
      </div>
    </main>
  );
}
