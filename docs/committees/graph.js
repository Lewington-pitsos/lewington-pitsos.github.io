start = new Date();

function getLinks(group) {
    return {source: group.s.start, 
              target: group.s.end }
}


const partyMap = {
    "Australian Labor Party": "#E13940",
    "Liberal Party of Australia": "#1C4F9C",
    "The Nationals": "FFF200",
    "Australian Greens": "#009C3D"
}

const links = records.map(getLinks);
const nodes = []
const ids = new Set();

records.forEach(function(record) {
    if (!ids.has(record.c.identity)) {
        ids.add(record.c.identity)
        nodes.push({id: record.c.identity, 
            name: record.c.properties.name + ' (' + String(Math.round(record.c.properties.centrality * 100) / 100) + ")", type: 'committee', 
        centrality: record.c.properties.centrality, 
    })
    }

    if (!ids.has(record.r.identity)) {
        ids.add(record.r.identity)
        nodes.push({
            id: record.r.identity, 
            name: record.r.properties.name + ' (' + String(Math.round(record.r.properties.centrality * 100) / 100) + ")", 
            party: record.r.properties.party,
            centrality: record.r.properties.centrality, 
            type:'representative'
        })
    }
})

 console.log(links.length+" links loaded "+(new Date()-start)+" ms.")
 const gData = { nodes: nodes,
                 links: links}

const Graph = ForceGraph3D()(document.getElementById('3d-graph'))
    .nodeColor(d => d.type === 'committee' ? '#c334eb' : partyMap[d.party])
    .nodeVal(d => Math.min(Math.max(d.centrality ** 5, 0.2), 400))
    .cooldownTicks(50)
    .graphData(gData)
    .linkDirectionalArrowLength(3.5)
    .linkDirectionalArrowRelPos(1)

Graph.onEngineStop(() => Graph.zoomToFit(400))