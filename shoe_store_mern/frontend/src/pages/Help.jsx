import Layout from '../components/Layout';

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order is placed, you can view its status in your Account page. We will also update you via phone.' },
  { q: 'What payment methods are accepted?', a: 'We currently accept Cash on Delivery and Bank Transfer.' },
  { q: 'Can I return or exchange a product?', a: 'Yes, items can be returned within 7 days of delivery if unused and in original packaging. Contact us to arrange a return.' },
  { q: 'How long does delivery take?', a: 'Delivery usually takes 3-5 business days depending on your location.' },
];

export default function Help() {
  return (
    <Layout>
      <div className="container py-5">
        <h2 className="section-title">HELP & SUPPORT</h2>
        <div className="auth-card" style={{ maxWidth: 700 }}>
          {faqs.map((f, i) => (
            <div key={i} className="mb-4">
              <h6 className="fw-bold">{f.q}</h6>
              <p className="text-muted" style={{ marginBottom: 0 }}>{f.a}</p>
            </div>
          ))}
          <p className="text-muted mt-3">Still need help? <a href="/contact">Contact our team</a>.</p>
        </div>
      </div>
    </Layout>
  );
}
