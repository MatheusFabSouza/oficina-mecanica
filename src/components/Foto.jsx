export default function Foto({ src, alt = '', tamanho = 64, arredondado = false }) {
  const estilo = {
    width: tamanho,
    height: tamanho,
    objectFit: 'cover',
    flexShrink: 0,
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={estilo}
        className={arredondado ? 'rounded-circle border' : 'rounded border'}
      />
    );
  }

  const inicial = alt ? alt.charAt(0).toUpperCase() : '?';

  return (
    <div
      style={estilo}
      className={`bg-secondary text-white d-inline-flex align-items-center justify-content-center fw-bold ${
        arredondado ? 'rounded-circle' : 'rounded'
      }`}
    >
      {inicial}
    </div>
  );
}