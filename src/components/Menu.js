import React from 'react';

export class Menu extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { startDijkstra, reset, setVelocity, currentVelocity, prompt } = this.props;

        return (
            <div>
                <header className="header">
                    <ul>
                        <li className='button' onClick={startDijkstra} >{prompt}</li>
                        <li className='button' onClick={reset} >Reset</li>
                        <li className='inline velocity' >
                            <span className='label' >Velocity:</span>
                            <select select={currentVelocity} className='select-css' onChange={setVelocity} >
                                <option value='na' >-</option>
                                <option value='slow' >Slow</option>
                                <option value='medium' >Medium</option>
                                <option value='fast' >Fast</option>
                            </select>
                        </li>

                    </ul>
                </header>
                <ul className='legend' >
                    <li className='legendItem legendItem1' > <div className='legendStart' ></div>Start Node</li>
                    <li className='legendItem legendItem2' > <div className='legendEnd' ></div>End Node</li>
                    <li className='legendItem legendItem3' > <div className='legendVisitedNodes' ></div>Visited Nodes</li>
                    <li className='legendItem legendItem4' > <div className='legendShortestPath' ></div>Shortest Path Nodes</li>
                    <li className='legendItem legendItem5' > <div className='legendWall' ></div>Wall</li>
                </ul>
            </div>
        );
    }

}