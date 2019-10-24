import React from 'react'
import Node from './Node'
import { Dijkstra } from '../algoritm/dijkstra'
import { Menu } from './Menu'

let START_COL = '10';
let START_ROW = '7';
let END_COL = '25';
let END_ROW = '7';
const ROW_NUMBER = 15;
const COL_NUMBER = 35;
let VEL = 40;

const createNode = (row, col) => {
    return {
        row,
        col,
        distance: Infinity,
        isStart: row == START_ROW && col == START_COL,
        isEnd: row == END_ROW && col == END_COL,
        isWall: false,
        isVisited: false,
        previousNode: null
    }
}
export class Pathfinding extends React.Component {

    constructor() {
        super();
        this.state = { grid: [], mouseDown: false, changeStart: false, changeEnd: false, row: '', col: '', prompt: 'Start Dijkstra', velocity: 'na' };
        this.reference = React.createRef();
    }
    componentDidMount() {
        window.addEventListener('animationend', function (event) {
            let myClass = event.srcElement.className;
            myClass = myClass.replace('animated', '');
            myClass = myClass.replace('fadeIn', '');
            event.srcElement.className = myClass;

        })
        this.resetGrid();
    }
    componentWillUnmount() {
        window.removeEventListener('animationend');
    }
    render() {
        const matrix = this.state.grid;
        return (
            <div>
                <Menu startDijkstra={this.runDijkstra} reset={this.resetGrid} setVelocity={this.setVelocity} currentVelocity={this.state.velocity} prompt={this.state.prompt} />
                <div className='pathfinding'>
                    <div id='divGrid' style={{ alignSelf: 'center', overflowX: 'auto' }} >
                        <table className='Grid' ref={this.reference} >
                            {
                                matrix.map((row, rowIndex) =>
                                    <tr key={rowIndex} id={rowIndex} className='row'>
                                        {
                                            row.map((cols, colIndex) => {
                                                const { row, col, distance, isStart, isEnd, isWall } = cols;
                                                return (<Node key={row + '-' + col} row={row} col={col} distance={distance}
                                                    isStart={isStart} isEnd={isEnd}
                                                    onMouseDown={this.onMouseDown}
                                                    onMouseUp={this.onMouseUp}
                                                    onMouseEnter={this.onMouseEnter}
                                                    mouseDown={this.state.mouseDown}
                                                    rowPressed={this.state.row}
                                                    colPressed={this.state.col}
                                                    isWall={isWall}
                                                    refer={this.reference}
                                                    onChangeStart={this.onChangeStart}
                                                    onChangeEnd={this.onChangeEnd}
                                                    changeStart={this.state.changeStart}
                                                    changeEnd={this.state.changeEnd}
                                                    setNewStartEnd={this.setNewStartEnd} > </Node>)
                                            })
                                        }
                                    </tr>)
                            }
                        </table>
                    </div>
                </div>
            </div>
        )
    }
    resetGrid = () => {
        let rows = [];
        let grid = [];
        for (let i = 0; i < ROW_NUMBER; i++) {
            for (let k = 0; k < COL_NUMBER; k++) {
                rows.push(createNode(i, k));

                if (this.reference.current.childNodes.length > 0) {
                    const refNode = this.reference.current.childNodes[i].childNodes[k];
                    if (refNode.className.indexOf('start') == -1) {
                        if (refNode.className.indexOf('end') == -1) {
                            if (refNode.className.indexOf('mouseDown') == -1) {
                                refNode.style.backgroundColor = ''
                            }
                        }
                    }
                    this.reference.current.childNodes[END_ROW].childNodes[END_COL].style.backgroundColor = '';
                }
            }
            grid.push(rows);
            rows = [];
        }
        if (this.reference.current.childNodes.length > 0) {
            this.reference.current.childNodes[START_ROW].childNodes[START_COL].className = 'col start';
            this.reference.current.childNodes[END_ROW].childNodes[END_COL].className = 'col end';

        }
        this.setState({ grid });
    }
    clearGrid = () => {
        const grid = this.state.grid;
        for (let i = 0; i < ROW_NUMBER; i++) {
            for (let k = 0; k < COL_NUMBER; k++) {

                grid[i][k].distance = Infinity;
                grid[i][k].isVisited = false;
                grid[i][k].previousNode = null;

                const refNode = this.reference.current.childNodes[i].childNodes[k];

                if (refNode.className.indexOf('start') == -1) {
                    if (refNode.className.indexOf('end') == -1) {
                        if (refNode.className.indexOf('mouseDown') == -1) {
                            if (refNode.className.indexOf('isWall') == -1) {
                                refNode.style.backgroundColor = '';
                                refNode.className = 'col'
                            }

                        }
                    }
                }
            }
        }
        if (this.reference.current.childNodes.length > 0) {
            this.reference.current.childNodes[START_ROW].childNodes[START_COL].className = 'col start';
            this.reference.current.childNodes[END_ROW].childNodes[END_COL].className = 'col end';
            this.reference.current.childNodes[END_ROW].childNodes[END_COL].style.backgroundColor = '';
        }
        this.setState({ grid });
    }
    visualizeShortedPath = (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            setTimeout(() => {
                this.reference.current.childNodes[node.row].childNodes[node.col].style.backgroundColor = '#A5AEE8';
                this.reference.current.childNodes[node.row].childNodes[node.col].className += ' animated fadeIn ';

                if (i == nodes.length - 1) {
                    let prevNode = null;
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i];
                        setTimeout(() => {
                            this.reference.current.childNodes[node.row].childNodes[node.col].style.backgroundColor = 'rgba(255, 255, 0, 0.700)';
                            this.reference.current.childNodes[node.row].childNodes[node.col].className += ' animated fadeIn ';

                            if (prevNode !== null) {
                                this.reference.current.childNodes[prevNode.row].childNodes[prevNode.col].className = 'col ';
                                this.reference.current.childNodes[node.row].childNodes[node.col].className = 'col start';
                            }
                            this.reference.current.childNodes[START_ROW].childNodes[START_COL].className = 'col moreTransparency';
                            prevNode = node;
                        }, VEL * 2 * i);
                    }
                }
            }, VEL * i);
        }
    }

    visualizeDijkstra = (nodes) => {
        const visitedNodes = nodes.visitedNodes;
        for (let i = 0; i < visitedNodes.length; i++) {
            const node = visitedNodes[i];
            setTimeout(() => {
                if (i == visitedNodes.length - 1) {
                    if (nodes.shortestPath.length >= 2) {
                        this.visualizeShortedPath(nodes.shortestPath);
                    }
                }
                this.reference.current.childNodes[node.row].childNodes[node.col].style.backgroundColor = 'rgba(0, 0, 255, 0.308)';
                this.reference.current.childNodes[node.row].childNodes[node.col].className += ' animated fadeIn ';
            }, VEL * i);
        }
    }

    runDijkstra = () => {
        if (this.state.velocity === 'na') {
            this.setState({ prompt: 'Set Velocity', velocity: 'na' });
            return;
        }

        this.clearGrid();
        const grid = this.state.grid;
        const startNode = grid[START_ROW][START_COL];
        const endNode = grid[END_ROW][END_COL];
        const dijkstraAlg = new Dijkstra(grid, startNode, endNode);
        dijkstraAlg.execute();
        dijkstraAlg.getShortedPath();
        this.visualizeDijkstra(dijkstraAlg);
    }

    onMouseDown = (row, col) => {
        this.setState({ mouseDown: true, row, col });
        this.setPressed(row, col);
    }
    onMouseUp = () => {

        if (this.state.changeStart) {
            START_COL = this.state.col;
            START_ROW = this.state.row;
            this.state.grid[START_ROW][START_COL].isStart = true;
            this.setState({ grid: this.state.grid });
        }
        if (this.state.changeEnd) {
            END_COL = this.state.col;
            END_ROW = this.state.row;
            this.state.grid[END_ROW][END_COL].isEnd = true;
            this.setState({ grid: this.state.grid });
        }

        this.setState({ mouseDown: false, changeStart: false, changeEnd: false });
    }
    onMouseEnter = (row, col) => {
        this.setState({ row, col });
        this.setPressed(row, col);
    }
    setPressed = (row, col) => {
        let matrix = this.state.grid;
        for (let i = 0; i < matrix.length; i++) {
            for (let k = 0; k < matrix[i].length; k++) {
                if (matrix[i][k].col == col && matrix[i][k].row == row) {
                    matrix[i][k].isWall = !matrix[i][k].isWall;
                }
            }
        }
    }
    onChangeStart = (row, col) => {
        this.state.grid[row][col].isStart = false;
        this.setState({ changeStart: true, row, col, grid: this.state.grid });

        this.setNewStartEnd(row, col);

    }
    onChangeEnd = (row, col) => {
        this.state.grid[row][col].isEnd = false;
        this.setState({ changeEnd: true, row, col, grid: this.state.grid });

        this.setNewStartEnd(row, col);
    }
    setNewStartEnd = (row, col) => {
        const matrix = this.state.grid;
        if (this.state.changeStart) {
            for (let i = 0; i < matrix.length; i++) {
                for (let k = 0; k < matrix[i].length; k++) {
                    if (matrix[i][k].col == col && matrix[i][k].row == row) {
                        //this.reference.current.childNodes[i].childNodes[k].className = 'col start';
                        if (matrix[i][k].isWall) matrix[i][k].isWall = false;
                        if (!matrix[i][k].isEnd) matrix[i][k].isStart = true;
                    }
                }
            }
            if (!matrix[row][col].isEnd) {
                matrix[START_ROW][START_COL].isStart = false;
                START_COL = col;
                START_ROW = row;
            }

        }
        if (this.state.changeEnd) {
            for (let i = 0; i < matrix.length; i++) {
                for (let k = 0; k < matrix[i].length; k++) {
                    if (matrix[i][k].col == col && matrix[i][k].row == row) {
                        if (matrix[i][k].isWall) matrix[i][k].isWall = false;
                        if (!matrix[i][k].isStart) matrix[i][k].isEnd = true;
                    }
                }
            }
            if (!matrix[row][col].isStart) {
                matrix[END_ROW][END_COL].isEnd = false;
                END_COL = col;
                END_ROW = row;
            }

        }

        this.setState({ row, col, grid: matrix });

    }

    setVelocity = (event) => {
        const velocity = event.target.value;

        switch (velocity) {
            case 'na':
                this.setState({ prompt: 'Set Velocity', velocity: 'na' });
                break;
            case 'slow':
                this.setState({ prompt: 'Start Dijkstra', velocity: 'slow' });
                VEL = 100;
                break;
            case 'medium':
                this.setState({ prompt: 'Start Dijkstra', velocity: 'medium' });
                VEL = 40;
                break;
            case 'fast':
                this.setState({ prompt: 'Start Dijkstra', velocity: 'fast' });
                VEL = 10;
                break;
            default:
                this.setState({ prompt: 'Set Velocity', velocity: 'na' });
                VEL = 30;
                break;


        }
    }
}