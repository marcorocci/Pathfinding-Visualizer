/* Grid:
        row,
        col,
        distance: Infinity,
        isStart: row == START_ROW && col == START_COL,
        isEnd: row == END_ROW && col == END_COL,
        isWall: false,
        isVisited: false,
        previousNode: null
*/
export class Dijkstra {
    constructor(graph, src, end) {
        //numero di righe
        this.row = graph.length;
        //numero di colonne
        this.col = graph[0].length;
        // parti da
        this.startNode = src;
        //il grafo a matrice
        this.graph = graph;

        this.endNode = end;

        this.visitedNodes = null;
        this.shortestPath = null;
    }
    execute() {
        //il nodo padre della dist[n](distanza dal nodo n) che termina sempre per SRC.  Settato a -1 inizialmente
        const parent = [];
        //metto SRC a 0, nodo dove partire
        this.startNode.distance = 0;
        this.startNode.isVisited = true;

        //creo la lista di tutti i nodi
        const queue = this.getAllNodes();
        while (queue.length > 0) {
            this.sortNodeByDistance(queue);
            //la minima distanza
            const closestNode = queue.shift();

            if (closestNode.isWall) {
                continue;
            }
            if (closestNode == this.endNode) {
                this.visitedNodes = parent;
                break;
            }
            if (closestNode.distance == Infinity) {
                this.visitedNodes = parent;
                break;
            }
            //Scorro i nodi che non ho visitato. Cerco gli adiacenti,
            // e sommo gli archi, se è minore del valore che già ho
            // mi salvo il nodo e la distanza

            const neighbours = this.getNeighbours(closestNode);

            for (const neighbour of neighbours) {
                neighbour.isVisited = true;
                neighbour.distance = closestNode.distance + 1;
                neighbour.previousNode = closestNode;
            }
            parent.push(closestNode);

        }
        //this.printSolution(dist, parent);
    }

    getShortedPath = () => {
        const currentPath = [];
        let node = this.endNode;
        while (node != null) {
            currentPath.unshift(node);
            node = node.previousNode;
        }
        this.shortestPath = currentPath;
    }

    sortNodeByDistance = (nodes) => {
        nodes.sort((a, b) => { return a.distance - b.distance; });
    }

    getNeighbours = (node) => {
        const neighbors = [];
        const { col, row } = node;
        if (row > 0) neighbors.push(this.graph[row - 1][col]);
        if (row < this.graph.length - 1) neighbors.push(this.graph[row + 1][col]);
        if (col > 0) neighbors.push(this.graph[row][col - 1]);
        if (col < this.graph[0].length - 1) neighbors.push(this.graph[row][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }

    getAllNodes = () => {
        const nodes = [];
        for (let i of this.graph) {
            for (let k of i) {
                nodes.push(k);
            }
        }
        return nodes;
    }
    minDistance(dist, queue) {
        let minimum = Infinity;
        let min_index = -1;

        //Scorro i nodi che non ho visitato. Prendo il nodo più vicino.
        queue.map((i) => {
            if (dist[i] < minimum) {
                minimum = dist[i];
                min_index = i;
            }
        });
        return min_index;
    }
    printPath(parent, j, s) {

        if (parent[j] === -1) {
            s.push(j);
            return;
        }
        s.push(j)
        this.printPath(parent, parent[j], s);

    }
    printSolution(dist, parent) {
        let src = 0;
        let s = [];

        for (let i = 1; i < dist.length; i++) {

            this.printPath(parent, i, s);

            console.log('\n' + src + ' --> ' + i + '\t\t' + dist[i] + '\t\t' + s.reverse());
            s = [];
        }
    }
}





