


const callsigns = Array(32).fill(null).map((_, i) => i + 1);

function makeDate(i) {
  const d = new Date();
  
  d.setMinutes(d.getMinutes() + 30 + i);
  
  return d;
}

(async () => {
  for (const cs of callsigns) {
    await fetch('http://localhost:3030/api/v1/pilots', {
      method: 'POST',
      body: JSON.stringify({
        "callsign": `TST${cs}`,
        "position": {"lat": 1, "lon": 1},
        "flightplan": {"adep":"XXXX", "ades": "ZZZz"},
        "vacdm": {"eobt": makeDate(cs), "tobt": -1},
        "clearance": {"dep_rwy": "187", "sid": "PIMML5L"}
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => {
      r.json().then(console.log)
    })
  }
})();
