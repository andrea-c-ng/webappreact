import React, { Component } from 'react';
import GridLayout from "react-grid-layout";
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import styles from './mystyle.module.css';
//import { Grid, Button, Modal } from '@mui/material';
//import { styled } from "@mui/material/styles"
//import HelpText from './HelpText'
//import gridBack from './static/gridBack.jpg'
//import sky from './static/sky.jpg'

const layout = [
    { i: "0", x: 0, y: 0, w: 1, h: 2, name: "父親" },
    { i: "1", x: 1, y: 0, w: 2, h: 2, name: "娘" },
    { i: "2", x: 3, y: 0, w: 1, h: 2, name: "母親" },
    { i: "3", x: 0, y: 2, w: 1, h: 2, name: "祖父" },
    { i: "4", x: 1, y: 2, w: 2, h: 1, name: "兄弟" },
    { i: "5", x: 1, y: 3, w: 1, h: 1, name: "花道" },
    { i: "6", x: 2, y: 3, w: 1, h: 1, name: "茶道" },
    { i: "7", x: 3, y: 2, w: 1, h: 2, name: "祖母" },
    { i: "8", x: 0, y: 4, w: 1, h: 1, name: "和裁" },
    { i: "9", x: 4, y: 4, w: 1, h: 1, name: "書道" },
]
const originalLayout = getFromLS("layout") || Object.assign([], layout);

function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("klotski")) || {};
        } catch (e) {
        }
    }
    return ls[key];
}

function saveToLS(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem("klotski", JSON.stringify({ [key]: value }))
    }
}
export class GameApp extends Component {
    targetElement = null;
    constructor(props) {
        super(props)
        this.state = {
            layout: JSON.parse(JSON.stringify(originalLayout)),
            prevLayout: [],
            dragged: null,
            win: false,
            helpOpen: false
        }
    }
    render() {
        return (
            <div>
                <grid className={styles.wrapper}>
                    <h1 style={{ margin: "15px 0 0 0", textShadow: "1px 1px 1px white" }}>Daughter in the box</h1>
                    <h4 style={{ margin: "5px 0" }}><i>-- a klotski game --</i></h4>
                    <button className={styles.button} onClick={this.reset}>Reset</button>
                    <GridLayout layout={this.state.layout} cols={4} rowHeight={70} width={280} margin={[2, 2]} containerPadding={[0, 0]} isResizable={false} preventCollision={true} compactType={null} onLayoutChange={this.onLayoutChange} onDragStart={this.onDragStart} onDragStop={this.onDragStop} draggableHandle=".moving-grid">
                        {
                            layout.map((block, i) => {
                                const classTag = ([0, 2, 3, 7].includes(i) ? styles.vBlock : ([5, 6, 8, 9].includes(i) ? styles.sBlock : (i === 4 ? styles.wBlock : styles.bBlock)))
                                return (
                                    <div
                                        className={this.state.win ? [styles.grid, classTag] : [styles.grid, "moving-grid", classTag]}
                                        key={block.i}>{block.name}
                                    </div>
                                )
                            }
                            )
                        }
                        <div key="z" data-grid={{ x: 0, y: 5, w: 4, h: 3, static: true }}></div>
                    </GridLayout>
                </grid>
            </div>
        );
    }
    componentDidMount() {
        this.targetElement = document.querySelector('#mainPanel');
        disableBodyScroll(this.targetElement);
    }
    componentWillUnmount() {
        clearAllBodyScrollLocks();
    }
    onLayoutChange = layout => {
        const dragged = this.state.dragged
        if (dragged) {
            const currentLayout = layout.slice(0, 10)
            const newItem = currentLayout[dragged]
            const oldItem = this.state.prevLayout[dragged]
            if (newItem.x !== oldItem.x || newItem.y !== oldItem.y) {
                if (Math.abs(newItem.x - oldItem.x) > 1 || Math.abs(newItem.y - oldItem.y) > 1 || (Math.abs(newItem.x - oldItem.x) >= 1 && Math.abs(newItem.y - oldItem.y) >= 1)) {
                    global.location.reload()
                } else {
                    let win = false
                    if (newItem.i === "1" && newItem.x === 1 && newItem.y === 3) {
                        win = true
                    }
                    this.setState({ layout: currentLayout, win: win })
                    saveToLS("layout", currentLayout)
                }
            }
        }
    }
    onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
        this.setState({
            prevLayout: Object.assign([], layout.slice(0, 10))
        })
    }
    onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
        this.setState({
            dragged: parseInt(newItem.i)
        })
    }
    openHelp = () => {
        this.setState({
            helpOpen: true
        })
    }
    handleClose = () => {
        this.setState({ helpOpen: false })
    }
    reset = e => {
        this.setState({
            layout: Object.assign([], layout),
            win: false
        })
        global.localStorage.clear()
    }
    //GameApp = styled(styles)(GameApp)
}