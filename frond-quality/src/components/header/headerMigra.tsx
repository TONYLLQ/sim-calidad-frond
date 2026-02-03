const headerStyle: React.CSSProperties = {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px 16px",
    zIndex: 1000,
};

const logoStyle: React.CSSProperties = {
    height: "auto",
    width: "auto",
};

export default function Header() {
    return (
        <header style={headerStyle}>
            <img src="https://agenciavirtual.migraciones.gob.pe/agencia-virtual/assets/img/migraciones-logo-small.png" alt="Logo Migraciones" style={logoStyle} />
        </header>
    );
}
