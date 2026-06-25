export const PlatformScreen = () => {
  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Platform</p>
          <h1 className="page-title">Platform admin</h1>
          <p className="page-lead">Manage registered businesses and their subscriptions.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <div className="state">
          <div className="state-emoji">🏬</div>
          <div className="state-title">Tenant management is coming soon</div>
          <p className="state-msg">
            This is where you'll see registered businesses, their subscriptions, and
            account controls. There's nothing for the platform owner to manage here yet.
          </p>
        </div>
      </div>
    </>
  );
};
