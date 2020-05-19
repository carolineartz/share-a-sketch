import React from "react"
import { Grommet, grommet, Box } from "grommet"
import times from "lodash.times"
import { ColorDesign } from "./views/ColorDesign"
// import firebase from "firebase/app"
// import "firebase/database"
// // const App = () => (
// //   <Grommet full theme={grommet}>
// //     <ColorDesign />
// //   </Grommet>
// // )

import firebase from "./Firebase"

export default class App extends React.Component {
  constructor(props: any) {
    super(props)
    ;(window as any).firebase = firebase

    // const colorsRef = firebase.database().ref("colors")
    // // const updates: Record<string, string> = {}
    // times(100, () => {
    //   const newColorKey = colorsRef.push().key
    //   if (newColorKey) {
    //     firebase
    //       .database()
    //       .ref(`/colors/${newColorKey}`)
    //       .set({ hue: 10, saturation: 0.8, lightness: 0.6 }, (err: any) => {
    //         if (err) {
    //           debugger
    //         }
    //       })

    //     // updates[`/colors/${newColorKey}`] = "#fff"
    //   }
    // })

    // debugger

    // firebase.database().ref().update(updates)
  }

  render() {
    // ;(window as any).firebase = firebase
    // const foo = firebase.database().ref("colors").orderByKey()
    // debugger
    return (
      <Grommet full theme={grommet}>
        <ColorDesign />
      </Grommet>
    )
  }
}
