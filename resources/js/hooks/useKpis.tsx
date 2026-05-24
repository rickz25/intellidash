// import { useEffect, useState } from "react";

// export function useKpis() {
//     const [kpis, setKpis] = useState({
//         revenue: 0,
//         sales: 0,
//         inventory: 0,
//         fraud_alerts: 0,
//     });

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch("/dashboard/kpis")
//             .then(res => res.json())
//             .then(data => {
//                 setKpis(data);
//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//     }, []);

//     return { kpis, loading };
// }