export function DeviceInfo({ id, name }: { id: string; name: string }) {
  return (
    <>
      <p>Device ID: {id}</p>
      <p>Device Name: {name}</p>
    </>
  );
}
