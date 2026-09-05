import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SafetyDisclaimer from '../components/SafetyDisclaimer';
import { getAllOfflineCategories } from '../data/offlineFirstAid';
import { 
  Phone, 
  Navigation, 
  Stethoscope, 
  ShieldAlert, 
  ArrowRight, 
  HeartPulse, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Building2, 
  Siren, 
  Scale, 
  Target, 
  HeartHandshake,
  LayoutDashboard
} from 'lucide-react';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const hi = language === 'hi';

  const commonCategories = getAllOfflineCategories().slice(0, 6);

  // Auto-scroll to section if hash exists in URL
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, []);

  return (
    <div className="landing-container">
      {/* ────────────────── SECTION 1: HOME (2-COLUMN HERO) ────────────────── */}
      <section id="home" className="landing-section landing-hero">
        <div className="hero-grid-container">
          {/* Left Column: Triage Callout, Headline, Action Buttons, Metric Strip */}
          <div className="hero-left-col">
            <div className="landing-badge landing-badge--alert">
              <span className="live-dot"></span>
              <ShieldAlert size={15} />
              <span>{hi ? '24/7 ग्रामीण आपातकालीन स्वास्थ्य सेतु' : '24/7 RURAL EMERGENCY HEALTH LIFELINE'}</span>
            </div>

            <h1 className="hero-main-title">
              {hi ? (
                <>
                  <span className="brand-accent">स्वास्थ्‍यसेतु</span>: आपातकाल में तुरंत सही कदम उठाएँ
                </>
              ) : (
                <>
                  <span className="brand-accent">SwasthyaSetu</span>: Immediate First-Aid &amp; Emergency Care
                </>
              )}
            </h1>

            <p className="hero-main-desc">
              {hi
                ? 'अपनी समस्या बोलकर या लिखकर बताएँ — सेकंडों में प्रमाणित प्राथमिक उपचार निर्देश, नजदीकी अस्पताल व आईसीयू नेविगेशन और आपातकालीन स्वास्थ्य प्रोफाइल पाएँ।'
                : 'Speak or type what happened — get verified step-by-step first-aid protocols, locate emergency trauma centers, and manage critical personal medical records instantly.'}
            </p>

            {/* Emergency Triage Interactive Card */}
            <div className="hero-triage-card" onClick={() => navigate('/emergency-input')} role="button" tabIndex={0}>
              <div className="hero-triage-icon">
                <Stethoscope size={26} />
              </div>
              <div className="hero-triage-text">
                <div className="hero-triage-prompt">
                  {hi ? 'क्या हुआ है? लक्षण बताएँ' : 'Tell us what happened'}
                </div>
                <div className="hero-triage-sub">
                  {hi ? 'बोलकर या लिखकर — तुरंत जीवन रक्षक कदम मिलेंगे' : 'Speak or type symptoms — get guided first-aid instantly'}
                </div>
              </div>
              <button type="button" className="hero-triage-btn">
                <span>{hi ? 'शुरू करें' : 'Start Triage'}</span>
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Quick Action Shortcuts: Call 112 & Find Hospitals */}
            <div className="hero-action-buttons">
              <a href="tel:112" className="hero-btn-call112">
                <Phone size={18} fill="currentColor" />
                <span>{hi ? '112 राष्ट्रीय आपातकाल' : 'Call 112 Emergency'}</span>
              </a>
              <Link to="/finder" className="hero-btn-finder">
                <Navigation size={18} />
                <span>{hi ? 'निकटतम अस्पताल व ICU' : 'Nearest ICU & Hospitals'}</span>
              </Link>
            </div>

            {/* Sleek 4-Metric Strip */}
            <div className="hero-metrics-strip">
              <div className="metric-item">
                <span className="metric-val">14+</span>
                <span className="metric-lbl">{hi ? 'मार्गदर्शिकाएँ' : 'Protocols'}</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">{hi ? 'ऑफ़लाइन सक्षम' : 'Offline Ready'}</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-val">&lt; 30s</span>
                <span className="metric-lbl">{hi ? 'त्वरित ट्रायज' : 'Triage Speed'}</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-val">0₹</span>
                <span className="metric-lbl">{hi ? 'नागरिकों हेतु मुफ़्त' : 'Free Always'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Immediate Emergency Quick Panel */}
          <div className="hero-right-col">
            <div className="quick-emergencies-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <HeartPulse size={20} color="#dc2626" />
                  <span>{hi ? 'त्वरित आपातकालीन प्रतिक्रिया' : 'Immediate Emergency Access'}</span>
                </div>
                <span className="panel-tag">{hi ? 'गोल्डन ऑवर' : 'Golden Hour'}</span>
              </div>

              <p className="panel-sub">
                {hi 
                  ? 'गंभीर स्थिति में तुरंत प्राथमिक उपचार मार्गदर्शिका खोलें:' 
                  : 'Select an emergency to view instant step-by-step protocol:'}
              </p>

              <div className="emergency-quick-grid">
                {commonCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="quick-emergency-card"
                    onClick={() => navigate(`/first-aid/${cat.id}`)}
                  >
                    <div className="quick-card-icon">{cat.icon}</div>
                    <div className="quick-card-info">
                      <span className="quick-card-name">{hi && cat.nameHi ? cat.nameHi : cat.name}</span>
                      <span className="quick-card-steps">
                        {cat.firstAidSteps.length} {hi ? 'प्राथमिक कदम' : 'first-aid steps'} • {cat.severity === 'critical' ? (hi ? 'गंभीर' : 'Critical') : (hi ? 'अत्यावश्यक' : 'Urgent')}
                      </span>
                    </div>
                    <ArrowRight size={16} className="quick-card-arrow" />
                  </button>
                ))}
              </div>

              <Link to="/library" className="panel-view-all">
                <span>{hi ? 'सभी 14+ आपातकालीन मार्गदर्शिकाएँ देखें' : 'View all 14+ Medical Emergency Guides'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 2: ABOUT ────────────────── */}
      <section id="about" className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge landing-badge--blue">
            <HeartPulse size={15} />
            <span>{hi ? 'हमारे बारे में' : 'ABOUT SWASTHYASETU'}</span>
          </div>
          <h2 className="landing-title">
            {hi ? 'स्वास्थ्यसेतु: गोल्डन ऑवर में जीवन और सुरक्षा का सेतु' : 'SwasthyaSetu: Bridging The Golden Hour Gap'}
          </h2>
          <p className="landing-subtitle">
            {hi
              ? 'स्वास्थ्यसेतु ग्रामीण और दूरदराज के क्षेत्रों के लिए बनाया गया आपातकालीन चिकित्सा प्लेटफ़ॉर्म है, जो एम्बुलेंस के आने से पहले के अमूल्य समय में सही प्राथमिक चिकित्सा और अस्पताल मार्गदर्शन प्रदान करता है।'
              : 'SwasthyaSetu is an emergency healthcare platform designed to empower every citizen, bystander, and rural family with actionable medical instructions and healthcare connectivity during the critical Golden Hour.'}
          </p>
        </div>

        <div className="about-cards-grid">
          {/* Card 1: The Golden Hour Rule */}
          <div className="about-feature-box about-feature-box--highlight">
            <div className="about-feature-box__title">
              <Clock size={24} color="#dc2626" />
              <span>{hi ? 'द गोल्डन ऑवर नियम (The Golden Hour Rule)' : 'The Golden Hour Rule'}</span>
            </div>
            <p className="about-feature-box__desc">
              {hi
                ? 'हार्ट अटैक, गंभीर रक्तस्राव या सड़क दुर्घटना के बाद पहले 60 मिनट को "गोल्डन ऑवर" कहा जाता है। यदि इस दौरान सही प्राथमिक उपचार मिले, तो 50% से अधिक लोगों की जान बचाई जा सकती है।'
                : 'The first 60 minutes following major trauma, cardiac arrest, or severe injury are known as the "Golden Hour". Timely and correct first-aid intervention during this window increases survival chances by over 50%.'}
            </p>
            <div className="golden-hour-badge-list">
              <span className="golden-pill">⏱️ {hi ? 'पहले 10 मिनट अति-संवेदनशील' : 'First 10 mins critical'}</span>
              <span className="golden-pill">🩸 {hi ? 'रक्तस्राव नियंत्रण' : 'Bleeding control'}</span>
              <span className="golden-pill">🫀 {hi ? 'CPR व वायुमार्ग सुरक्षा' : 'CPR & Airway support'}</span>
            </div>
          </div>

          {/* Card 2: Good Samaritan Protection */}
          <div className="about-feature-box">
            <div className="about-feature-box__title">
              <Scale size={24} color="#2563eb" />
              <span>{hi ? 'गुड सेमेरिटन (नेक नागरिक) कानून' : 'Good Samaritan Law Protection'}</span>
            </div>
            <p className="about-feature-box__desc">
              {hi
                ? 'भारत के माननीय सर्वोच्च न्यायालय के दिशानिर्देशों के तहत, किसी भी घायल या पीड़ित की सहायता करने वाले नागरिक को पुलिस पूछताछ, अदालती झंझट या अस्पताल शुल्क से पूर्ण कानूनी संरक्षण प्राप्त है। बिना झिझक मदद करें।'
                : 'Under the landmark Supreme Court of India guidelines, any bystander who helps an injured person is legally protected from police harassment, unnecessary detention, or liability for hospital bills. You can help fearlessly.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 700, fontSize: '0.88rem' }}>
              <CheckCircle2 size={18} />
              <span>{hi ? 'पूर्ण कानूनी सुरक्षा व सम्मान' : '100% Legal Protection Guaranteed'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 3: FEATURES ────────────────── */}
      <section id="features" className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge">
            <Sparkles size={15} />
            <span>{hi ? 'मुख्य सुविधाएँ' : 'CORE CAPABILITIES'}</span>
          </div>
          <h2 className="landing-title">
            {hi ? 'आपातकाल के हर मोड़ पर आपका डिजिटल सहारा' : 'Engineered For High-Stakes Emergencies'}
          </h2>
          <p className="landing-subtitle">
            {hi
              ? 'आपातकालीन लक्षणों की त्वरित पहचान से लेकर अस्पताल खोजने और व्यक्तिगत मेडिकल रिकॉर्ड प्रबंधन तक — सब कुछ एक ही मंच पर।'
              : 'From instant AI triage to hospital navigation, offline guides, and direct patient health records — everything built for speed and precision.'}
          </p>
        </div>

        <div className="features-grid-landing">
          {/* Feature 1 */}
          <div className="feature-landing-card">
            <div className="feature-icon-wrapper">
              <Stethoscope size={24} />
            </div>
            <h3 className="feature-landing-card__title">
              {hi ? 'AI आपातकालीन ट्रायज' : 'AI Emergency Triage'}
            </h3>
            <p className="feature-landing-card__desc">
              {hi
                ? 'अपनी स्थानीय भाषा (हिंदी या अंग्रेजी) में लक्षण बोलें या टाइप करें। सिस्टम तुरंत गंभीरता (गंभीर/अत्यावश्यक) और तुरंत उठाए जाने वाले कदम बताता है।'
                : 'Describe symptoms via voice or text in simple Hindi/English. The triage engine instantly identifies urgency and priority immediate steps.'}
            </p>
            <Link to="/emergency-input" className="feature-landing-card__action">
              <span>{hi ? 'ट्रायज शुरू करें' : 'Try Emergency Triage'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="feature-landing-card">
            <div className="feature-icon-wrapper">
              <BookOpen size={24} />
            </div>
            <h3 className="feature-landing-card__title">
              {hi ? '14+ ऑफ़लाइन प्राथमिक उपचार' : 'Offline First-Aid Protocols'}
            </h3>
            <p className="feature-landing-card__desc">
              {hi
                ? 'कार्डियक अरेस्ट, जलने, फ्रैक्चर, सांप के काटने और सांस रुकने जैसी आपात स्थितियों के लिए चरण-दर-चरण निर्देश और वीडियो, बिना इंटरनेट के भी उपलब्ध।'
                : '14+ medically verified first-aid manuals with critical dos & don\'ts and video tutorials that function seamlessly even with zero internet.'}
            </p>
            <Link to="/library" className="feature-landing-card__action">
              <span>{hi ? 'लाइब्रेरी देखें' : 'Browse First-Aid Guides'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="feature-landing-card">
            <div className="feature-icon-wrapper">
              <Building2 size={24} />
            </div>
            <h3 className="feature-landing-card__title">
              {hi ? 'जीपीएस अस्पताल व ICU लोकेटर' : 'GPS Hospital & ICU Finder'}
            </h3>
            <p className="feature-landing-card__desc">
              {hi
                ? 'इंटरएक्टिव मैप पर अपने निकटतम आपातकालीन अस्पताल, ट्रॉमा सेंटर और क्लिनिक खोजें। दूरी और सीधा नेविगेशन तुरंत प्राप्त करें।'
                : 'Interactive Leaflet map locating the nearest government hospitals, private ICUs, and 24x7 trauma care centers around your current location.'}
            </p>
            <Link to="/finder" className="feature-landing-card__action">
              <span>{hi ? 'अस्पताल खोजें' : 'Locate Hospitals Near Me'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="feature-landing-card">
            <div className="feature-icon-wrapper">
              <Siren size={24} />
            </div>
            <h3 className="feature-landing-card__title">
              {hi ? '24x7 राष्ट्रीय हेल्पलाइन' : '24x7 Verified Helplines'}
            </h3>
            <p className="feature-landing-card__desc">
              {hi
                ? 'राष्ट्रीय आपातकाल 112, एम्बुलेंस 108, महिला सुरक्षा 1091, और पॉइज़न कंट्रोल 1800-116-117 पर एक क्लिक में सीधे कॉल करने की सुविधा।'
                : 'One-touch verified emergency calling to 112 National Helpline, 108 Medical Ambulance, 102 Maternal Care, and Poison Control Centers.'}
            </p>
            <Link to="/emergency-services" className="feature-landing-card__action">
              <span>{hi ? 'हेल्पलाइन देखें' : 'View All Helplines'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="feature-landing-card" style={{ borderColor: '#fca5a5' }}>
            <div className="feature-icon-wrapper" style={{ background: '#fef2f2', color: '#b91c1c' }}>
              <LayoutDashboard size={24} />
            </div>
            <h3 className="feature-landing-card__title">
              {hi ? 'मरीज स्वास्थ्य व आपात डैशबोर्ड' : 'Patient Health & Emergency Dashboard'}
            </h3>
            <p className="feature-landing-card__desc">
              {hi
                ? 'बिना किसी लॉगिन झंझट के अपने डॉक्टर अप्वाइंटमेंट, मेडिकल पर्चे/रिपोर्ट, ब्लड ग्रुप, एलर्जी और प्राथमिक आपातकालीन संपर्क सुरक्षित रखें।'
                : 'Direct access to manage your doctor appointments, lab records, blood group, chronic conditions, and emergency family contacts — no login required.'}
            </p>
            <Link to="/my-dashboard" className="feature-landing-card__action" style={{ color: '#b91c1c', fontWeight: 850 }}>
              <span>{hi ? 'डैशबोर्ड खोलें' : 'Open Patient Dashboard'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="feature-landing-card">
            <div className="feature-icon-wrapper">
              <HeartPulse size={24} />
            </div>
            <h3 className="feature-landing-card__title">
              {hi ? 'द्विभाषी व हाई-कंट्रास्ट मोड' : 'Bilingual & High-Contrast Mode'}
            </h3>
            <p className="feature-landing-card__desc">
              {hi
                ? 'तनावपूर्ण आपात स्थिति में आसानी से पढ़ने के लिए विशेष बोल्ड व हाई-कंट्रास्ट डिस्प्ले और संपूर्ण हिंदी-अंग्रेजी द्विभाषी इंटरफ़ेस।'
                : 'Designed for stressful, low-light emergencies with high-contrast colorways, large tap targets, and comprehensive English & Hindi support.'}
            </p>
            <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginTop: '0.5rem' }}>
              ✓ {hi ? 'तुरंत भाषा व थीम बदलें' : 'Instant Language & Theme Toggle'}
            </span>
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 4: INSPIRATION ────────────────── */}
      <section id="inspiration" className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge landing-badge--amber">
            <HeartHandshake size={15} />
            <span>{hi ? 'यह विचार क्यों? / प्रेरणा' : 'WHY THIS IDEA? / INSPIRATION'}</span>
          </div>
          <h2 className="landing-title">
            {hi ? 'ग्रामीण भारत की जमीनी सच्चाई से जन्मी एक पहल' : 'Born From India\'s Rural Healthcare Reality'}
          </h2>
        </div>

        <div className="inspiration-box">
          <p className="inspiration-lead">
            {hi
              ? 'भारत के 70% से अधिक लोग गाँवों और कस्बों में रहते हैं, परंतु देश के 80% अस्पताल और विशेषज्ञ डॉक्टर शहरों में केंद्रित हैं। जब कोई दुर्घटना या आकस्मिक बीमारी होती है, तो एम्बुलेंस को पहुँचने में 45 से 90 मिनट तक लग जाते हैं। उस समय मरीज की जिंदगी केवल पास खड़े आम नागरिक की समझदारी पर निर्भर होती है।'
              : 'Over 70% of India\'s population resides in rural villages and tier-3 towns, yet nearly 80% of hospitals and medical specialists are concentrated in urban centers. When an emergency strikes, ambulances often take 45 to 90 minutes to navigate rural roads. In those terrifying minutes, survival depends entirely on the bystanders present.'}
          </p>

          <div className="inspiration-stats-grid">
            <div className="inspiration-stat-item">
              <div className="inspiration-stat-number">70%</div>
              <div className="inspiration-stat-title">{hi ? 'ग्रामीण आबादी' : 'Rural Population'}</div>
              <div className="inspiration-stat-detail">
                {hi ? 'जिनके पास प्राथमिक स्वास्थ्य सुविधा पहुँचने में लंबा समय लगता है।' : 'Lives in areas with limited immediate access to critical emergency care.'}
              </div>
            </div>

            <div className="inspiration-stat-item">
              <div className="inspiration-stat-number">50%</div>
              <div className="inspiration-stat-title">{hi ? 'गोल्डन ऑवर में मौतें' : 'Golden Hour Fatalities'}</div>
              <div className="inspiration-stat-detail">
                {hi ? 'सड़क व हृदय संबंधी मौतों को तुरंत सही प्राथमिक चिकित्सा देकर रोका जा सकता था।' : 'Accident & trauma deaths could be prevented if timely first aid was provided.'}
              </div>
            </div>

            <div className="inspiration-stat-item">
              <div className="inspiration-stat-number">10 min</div>
              <div className="inspiration-stat-title">{hi ? 'निर्णायक समय सीमा' : 'Decisive Window'}</div>
              <div className="inspiration-stat-detail">
                {hi ? 'घटना के शुरुआती 10 मिनट में उठाया गया सही कदम जीवन-मृत्यु का फ़ैसला करता है।' : 'Initial bystander actions dictate whether a patient survives until the hospital.'}
              </div>
            </div>
          </div>

          <div className="inspiration-quote-box">
            "{hi
              ? 'स्वास्थ्यसेतु की प्रेरणा इसी विश्वास से उपजी है कि किसी की जान केवल इसलिए नहीं जानी चाहिए क्योंकि पास खड़े व्यक्ति को यह नहीं पता था कि खून कैसे रोकें या सीपीआर कैसे दें। जीवन रक्षक ज्ञान हर नागरिक का अधिकार है।'
              : 'SwasthyaSetu was built on the core conviction that no human being should lose their life simply because the person next to them didn\'t know how to stop the bleeding or perform CPR. Life-saving medical knowledge belongs in every citizen\'s pocket.'}"
          </div>
        </div>
      </section>

      {/* ────────────────── SECTION 5: VISION & GOAL ────────────────── */}
      <section id="vision" className="landing-section">
        <div className="landing-section-header">
          <div className="landing-badge landing-badge--green">
            <Target size={15} />
            <span>{hi ? 'हमारा विज़न और लक्ष्य' : 'VISION & GOAL'}</span>
          </div>
          <h2 className="landing-title">
            {hi ? 'हर नागरिक एक प्राथमिक रक्षक, हर स्मार्टफोन एक जीवन रक्षक' : 'Every Citizen a First Responder, Every Phone a Lifeline'}
          </h2>
          <p className="landing-subtitle">
            {hi
              ? 'हमारा संकल्प भारत के दूरदराज के कोने-कोने तक आपातकालीन चिकित्सा मार्गदर्शन पहुँचाना और हर संकट में त्वरित जीवन रक्षक प्रतिक्रिया सुनिश्चित करना है।'
              : 'Our mission is to eliminate preventable emergency deaths across rural India by putting verified medical triage and healthcare tools into the hands of ordinary people.'}
          </p>
        </div>

        <div className="vision-grid">
          {/* Vision Card */}
          <div className="vision-card vision-card--accent">
            <div className="vision-card__header">
              <div className="vision-card__icon">
                <HeartPulse size={22} />
              </div>
              <h3 className="vision-card__title">{hi ? 'हमारा विज़न (Our Vision)' : 'Our Vision'}</h3>
            </div>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.6 }}>
              {hi
                ? 'एक ऐसा सशक्त और जागरूक भारत जहाँ भौगोलिक दूरी या इंटरनेट की अनुपस्थिति किसी मरीज के जीवन और मृत्यु के बीच की बाधा न बने। हर गाँव और परिवार के पास आपात स्थिति में तुरंत सही कदम उठाने का ज्ञान और आत्मविश्वास हो।'
                : 'An empowered India where geographical isolation, spotty connectivity, and lack of medical training never cost a life. A future where every village and household possesses the instant capability to stabilize patients during the Golden Hour.'}
            </p>
          </div>

          {/* Goal Card */}
          <div className="vision-card">
            <div className="vision-card__header">
              <div className="vision-card__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <Target size={22} />
              </div>
              <h3 className="vision-card__title">{hi ? 'हमारे प्रमुख लक्ष्य (Core Goals)' : 'Core Goals'}</h3>
            </div>

            <div className="goals-list">
              <div className="goal-item">
                <CheckCircle2 size={19} className="goal-icon" />
                <div className="goal-item-text">
                  <strong>{hi ? 'गोल्डन ऑवर में शून्य रोके जा सकने वाली मृत्यु:' : 'Zero Preventable Golden Hour Deaths:'}</strong>{' '}
                  {hi ? 'तत्काल सटीक निर्देशों द्वारा रक्तस्राव, घुटन और दिल के दौरे में तत्काल राहत।' : 'Deliver verified first-aid guidance in under 30 seconds to bystanders.'}
                </div>
              </div>

              <div className="goal-item">
                <CheckCircle2 size={19} className="goal-icon" />
                <div className="goal-item-text">
                  <strong>{hi ? '100% ऑफ़लाइन कार्यक्षमता:' : '100% Offline Resilience:'}</strong>{' '}
                  {hi ? 'दूरदराज के नेटवर्क-विहीन क्षेत्रों में भी पूरी मार्गदर्शिकाएं बिना रुकावट चलें।' : 'Zero reliance on high-speed internet for life-saving protocols.'}
                </div>
              </div>

              <div className="goal-item">
                <CheckCircle2 size={19} className="goal-icon" />
                <div className="goal-item-text">
                  <strong>{hi ? 'मातृभाषा में सरल चिकित्सा संचार:' : 'Universal Language Access:'}</strong>{' '}
                  {hi ? 'सरल बोलचाल की हिंदी और अंग्रेजी में स्पष्ट और निडर मार्गदर्शन।' : 'Intuitive bilingual visual and audio instructions for all literacy levels.'}
                </div>
              </div>

              <div className="goal-item">
                <CheckCircle2 size={19} className="goal-icon" />
                <div className="goal-item-text">
                  <strong>{hi ? 'मरीज स्वास्थ्य व आपात प्रबंधन:' : 'Direct Patient Care Management:'}</strong>{' '}
                  {hi ? 'बिना लॉगिन झंझट के ब्लड ग्रुप, एलर्जी व आपातकालीन संपर्कों का सीधा प्रबंधन।' : 'Frictionless patient profile, appointments, and emergency contacts accessible instantly.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Direct CTA Banner */}
        <div className="dashboard-cta-banner">
          <div className="dashboard-cta-banner__content">
            <div className="dashboard-cta-banner__title">
              {hi ? 'मरीज आपातकालीन डैशबोर्ड अभी खोलें' : 'Open Patient Emergency & Health Dashboard'}
            </div>
            <div className="dashboard-cta-banner__desc">
              {hi
                ? 'डॉक्टर अप्वाइंटमेंट बुक करें, अपने मेडिकल रिकॉर्ड संभालें, ब्लड ग्रुप व एलर्जी अपडेट करें, और आपातकालीन संपर्कों को सीधे डायल करें — बिना किसी लॉगिन के!'
                : 'Manage doctor appointments, health records, blood group, allergies, and emergency family contacts directly on your device — no login or sign-up needed!'}
            </div>
          </div>

          <Link to="/my-dashboard" className="btn-open-dashboard" id="cta-open-dashboard">
            <LayoutDashboard size={20} />
            <span>{hi ? 'डैशबोर्ड पर जाएँ' : 'Go to Dashboard'}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <SafetyDisclaimer />
    </div>
  );
}
