import React from 'react'

export default class Node extends React.Component {

    constructor() {
        super();

    }


    render() {
        const { row, col, isStart, isEnd, onMouseDown, onMouseUp, onMouseEnter, mouseDown, rowPressed,
            colPressed, isWall, onChangeStart, onChangeEnd, changeStart, changeEnd, setNewStartEnd } = this.props;


        const extraClass = isStart ? 'col start' : isEnd ? 'col end' : 'col';


        let mouseCss = '';


        if (rowPressed == row && colPressed == col && mouseDown) {
            mouseCss = 'animated fadeIn isWall';
        }
        if (isWall) {
            mouseCss = 'animated fadeIn isWall';
        }

        return (
            <td id={row + '-' + col} className={extraClass + ' ' + mouseCss}
                onMouseDown={() => {
                    if (!isStart && !isEnd) {
                        onMouseDown(row, col);
                    } else {
                        if (isStart) onChangeStart(row, col);
                        if (isEnd) onChangeEnd(row, col);
                    }

                }
                }
                onMouseUp={onMouseUp}
                onMouseEnter={() => {
                    if (mouseDown && !isStart && !isEnd) {
                        onMouseEnter(row, col)
                    }
                    if (changeStart || changeEnd) {
                        setNewStartEnd(row, col)
                    }
                }} >

            </td>
        )
    }
}