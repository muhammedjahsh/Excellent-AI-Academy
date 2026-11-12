export default function DataTable({ columns, rows }) {
  if (!rows?.length) {
    return <p className="muted empty-note">No rows.</p>;
  }
  const keys = columns?.length ? columns : Object.keys(rows[0]);
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {(Array.isArray(row) ? row : keys.map((key) => row[key])).map((cell, cellIndex) => (
                <td key={cellIndex}>{String(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
