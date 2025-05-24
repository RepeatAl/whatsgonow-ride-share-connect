
import { useEffect } from "react";

export default function PreRegister() {
  console.log('[DEBUG] PreRegister function called!');
  
  useEffect(() => {
    console.log('[DEBUG] PreRegister mounted!');
  }, []);
  
  return <div style={{ padding: '20px', fontSize: '24px', color: 'green' }}>PREREGISTER WORKS!</div>;
}
