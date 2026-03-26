import { Link, useParams } from 'react-router-dom';

const roleConfig = {
  admin: { label: 'Admin', short: 'A' },
  seller: { label: 'Seller', short: 'S' },
  user: { label: 'User', short: 'U' },
};

export default function Profile() {
  const { role } = useParams();
  const currentRole = roleConfig[role] ?? roleConfig.user;

  return (
    <section className="min-h-screen pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-2xl mx-auto border border-border bg-card p-6 sm:p-10">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">Subicharan Tex</p>
        <h1 className="mt-2 text-4xl font-serif text-foreground">{currentRole.label} Profile</h1>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans text-xl tracking-[0.08em]">
            {currentRole.short}
          </div>
          <div>
            <p className="font-sans text-lg text-foreground">Role: {currentRole.label}</p>
            <p className="font-sans text-sm text-muted-foreground">Dedicated profile view for {currentRole.label.toLowerCase()}.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/profile/admin" className="h-11 px-5 border border-border text-foreground text-xs tracking-[0.12em] uppercase flex items-center hover:bg-accent transition-colors">
            Admin Profile
          </Link>
          <Link to="/profile/seller" className="h-11 px-5 border border-border text-foreground text-xs tracking-[0.12em] uppercase flex items-center hover:bg-accent transition-colors">
            Seller Profile
          </Link>
          <Link to="/profile/user" className="h-11 px-5 border border-border text-foreground text-xs tracking-[0.12em] uppercase flex items-center hover:bg-accent transition-colors">
            User Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
