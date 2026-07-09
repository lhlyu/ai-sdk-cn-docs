export default function InstallPackages({ packages }: { packages?: string }) {
  if (!packages) return <div className="doc-placeholder">InstallPackages 缺少 packages</div>;

  const managers = [
    { name: 'pnpm', command: `pnpm add ${packages}` },
    { name: 'npm', command: `npm install ${packages}` },
    { name: 'yarn', command: `yarn add ${packages}` },
    { name: 'bun', command: `bun add ${packages}` },
  ];

  return (
    <div className="doc-install-packages">
      {managers.map(({ name, command }) => (
        <div key={name} className="doc-snippet">
          <code>
            <span className="doc-install-packages__manager">{name}</span> {command}
          </code>
        </div>
      ))}
    </div>
  );
}
