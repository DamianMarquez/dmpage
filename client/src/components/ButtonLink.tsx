import { Link } from 'react-router-dom';

type Props = {
  to: string;
  label: string;
};

export default function ButtonLink({ to, label }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Link to={to} style={{ padding: '0.5rem 1rem', textDecoration: 'none', border: '1px solid #ccc', borderRadius: '4px', color: '#333' }}>
        {label}
      </Link>
    </div>
  );
}
