import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { settings } = useApp();
  const siteName = settings?.general?.siteName || 'Turtle Buddy';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
      {/* Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Patient & Family Protection</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          Privacy Policy & Clinical Confidentiality
        </h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>
      </section>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Commitment to Child & Family Privacy</h2>
          <p>
            At {siteName}, protecting the confidential healthcare and developmental information of your child and
            family is our highest priority. This Privacy Policy details how we collect, store, and safeguard
            information submitted through our website and during clinical assessments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Intake Contact Details:</strong> Parent/guardian full names, contact telephone numbers,
              email addresses, and residential general area.
            </li>
            <li>
              <strong>Child Developmental Details:</strong> Child's date of birth or age, areas of therapy
              interest (e.g. ABA, Speech, OT), and developmental milestones voluntarily shared during booking.
            </li>
            <li>
              <strong>Clinical Assessment Records:</strong> Standardized diagnostic scoring, session notes, and
              progress videos strictly preserved within secure clinical records.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. How Information is Used & Protected</h2>
          <p>
            All submitted intake records are encrypted in transit and stored in protected servers accessible only
            by certified clinical directors and intake staff. We do not sell, rent, or trade your family’s contact
            information or medical data to third-party advertisers or external entities under any circumstances.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Parental Rights & Access</h2>
          <p>
            Parents and legal guardians retain the right at any time to inspect their child’s clinical
            evaluations, request copies of progress reports for school transitions, or request data corrections.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-bold text-slate-900">5. Privacy Officer Contact</h2>
          <p>
            If you have questions regarding our privacy practices or wish to submit a data request, please reach out
            to:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-800">{siteName} Privacy & Compliance Office</p>
            <p>Email: {settings?.general?.email || 'care@turtlebuddycentre.org'}</p>
            <p>Phone: {settings?.general?.phone || '+1 (800) 489-3221'}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
