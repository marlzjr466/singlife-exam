import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SelectList } from 'react-native-dropdown-select-list'
import { Dimensions, Text, View, TouchableOpacity, Modal, Pressable, TextInput, Image } from 'react-native'

import styles from './Styles'

export default function App() {
    const [entries, setEntry] = useState(3)
    const [vehicles, setVehicles] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [parkModalVisible, setParkModalVisible] = useState(false)
    const [spaceModalVisible, setSpaceModalVisible] = useState(false)
    const [unParkModalVisible, setUnParkModalVisible] = useState(false)
    const [parkingSize, setParkingSize] = useState('SP')
    const [plateNum, setPlateNum] = useState('')
    const [parkingMap, setParkingMap] = useState([])
    const [activeSpace, setActiveSpace] = useState({
        time: {start:null, end:null}
    })
    const [spaceAvailable, setSpaceAvailable] = useState(0)
    const [activeEntry, setActiveEntry] = useState(0)

    const PSdata = [
        {key:0, value:'SP'},
        {key:1, value:'MP'},
        {key:2, value:'LP'}
    ]

    useEffect(()=>{
         initEntry()
    },[])

    // Use to increment char for the parking space name
    function nextChar(char) {
        return String.fromCharCode(char.charCodeAt(0) + 1);
    }

    const initEntry = () => {
        if (entries < 1) return // prevent input that is less than 1
        let tempMap = []
        let name = 'A'
        
        if (parkingMap.length > 0) {
            for (let i = 0; i < parkingMap.length; i++) { // Getting the next char for the name of the spaces
                name = nextChar(name)
            }

            tempMap = parkingMap
        }

        // generate a dynamic object  for the map
        for (let i = 0; i < entries; i++) {
            let spaces = []
            for (let j = 0; j < 12; j++) { // 12 is for the static number of parking space in every entry
                if (j < 4)  var val = 0, label = 'SP', price = 20
                else if (j < 8) var val = 1, label =  'MP', price = 60
                else var val = 2, label =  'LP', price = 100

                spaces.push({
                    name: `${name}${j+1}`,
                    price: price,
                    size: {
                        value: val,
                        label: label,
                    },
                    available: 0,
                    vehicle: {}
                })
            }
        
            name = nextChar(name)
            tempMap.push(spaces)
        }

        setTimeout(()=>{
            setModalVisible(false)
            setEntry(0)
            setParkingMap(tempMap)
        },500)
        
    }

    const park = () => {
        let vehicleSize = parkingSize == 'SP' ? 0 : (parkingSize == 'MP' ? 1 : 2)
        let findParking = 0
        let tempParkingMap = parkingMap
        let tempVehicles = vehicles
        let vehicle = {
            pn: plateNum,
            size: vehicleSize,
            parktime: {
                start: new Date().getTime(),
                end: 0
            }
        }

        let existVehicle = tempVehicles.filter(item => item.pn === plateNum && item.parktime.end != 0)
        if (existVehicle.length > 0) {
            let curr_time = new Date().getTime()
            let time_gap = curr_time - existVehicle[0].parktime.end
            let totaltimegap = timeToDecimal(msToTime(time_gap))
            if (totaltimegap <= 1) {
                vehicle.parktime.start = existVehicle[0].parktime.start
            }
        }
        

        for (let i = 0; i < tempParkingMap.length; i++) {
            for (let j = 0; j < 12; j++) {
                if (tempParkingMap[i][j].available == 0) {
                    if (vehicleSize == 0) {
                        tempParkingMap[i][j].available = 1
                        tempParkingMap[i][j].vehicle = {
                            plateNum: plateNum
                        }
                        findParking = 1
                        break
                    } else if (vehicleSize == 1 && tempParkingMap[i][j].size.value > 0) {
                        tempParkingMap[i][j].available = 1
                        tempParkingMap[i][j].vehicle = {
                            plateNum: plateNum
                        }
                        findParking = 1
                        break
                    } else if (vehicleSize == 2 && tempParkingMap[i][j].size.value > 1) {
                        tempParkingMap[i][j].available = 1
                        tempParkingMap[i][j].vehicle = {
                            plateNum: plateNum
                        }
                        findParking = 1
                        break
                    }
                }
            } if (findParking == 1) break
        }

        tempVehicles.push(vehicle)

        if (findParking == 1) {
            setVehicles(tempVehicles)
            setParkingMap(tempParkingMap)
            setTimeout(()=>{
                setParkModalVisible(!parkModalVisible)
            },500)
        } else {
            console.log('Full')
        }
    }

    const nextEntry = () => {
        let temp_AE = activeEntry
        if (temp_AE === parkingMap.length-1) {
            temp_AE = 0
        } else temp_AE++

        getAvailableSpace(temp_AE)
        setActiveEntry(temp_AE)
    }

    const prevEntry = () => {
        let temp_AE = activeEntry
        if (temp_AE === 0) {
            temp_AE = parkingMap.length-1
        } else temp_AE--

        getAvailableSpace(temp_AE)
        setActiveEntry(temp_AE)
    }

    const getAvailableSpace = (index) => {
        let tempParkingMap = parkingMap
        setSpaceAvailable(tempParkingMap[index].filter(item=> {
            return item.available === 0
        }).length)
    }

    const spaceInfo = (space) => {
        let vehicle = vehicles.filter(vehicle => vehicle.pn == space.vehicle.plateNum)
        let consumeHours = msToTime(new Date().getTime() - vehicle[0].parktime.start)

        let tempSpace = {
            name: space.name + '-' + space.size.label,
            price: space.price,
            pn: vehicle[0].pn,
            date: new Date(vehicle[0].parktime.start).toLocaleString().split(', ')[0],
            time: {
                start: new Date(vehicle[0].parktime.start).toLocaleString().split(', ')[1],
                end: null
            },
            ch: consumeHours,
            totalHours: 0,
            payableHours: 0
        }

        setActiveSpace(tempSpace)
        setSpaceModalVisible(true)
    }

    const unpark = () => {
        setSpaceModalVisible(false)

        let tempSpace = activeSpace
        let tempParkingMap = parkingMap
        let vehicle = vehicles.filter(vehicle => vehicle.pn == tempSpace.pn)

        vehicle[0].parktime.end = new Date().getTime() // set park end time of vihicle

        let totalhours = timeToDecimal(msToTime(vehicle[0].parktime.end - vehicle[0].parktime.start))
        let decimal = totalhours - parseInt(totalhours)
        totalhours = decimal < .5 ? Math.round(totalhours * 10) / 10 :  // round off to 1 decimal place
                        Math.round(Math.round(totalhours * 10) / 10) // round off the nearest integer if decimal >= .5

        tempSpace.time.end = new Date(vehicle[0].parktime.end).toLocaleString().split(', ')[1]
        tempSpace.totalHours = totalhours
        if (totalhours <= 3)
            tempSpace.payableHours = 40 // set 40 if totalhours <= 3
        else {
            let th = totalhours - 3
            tempSpace.payableHours = Math.round((tempSpace.price * th) * 100) / 100 // round off to 2 decimal places
        }

        // update parking map
        let spaceName = tempSpace.name.split('-')[0]
        tempParkingMap.forEach(space => {
            space.forEach(item => {
                if (spaceName === item.name) {
                    item.available = 0
                    item.vehicle = {}
                }
            })
        })
        
        setActiveSpace(tempSpace)
        setTimeout(()=>{
            setParkingMap(tempParkingMap)
            setUnParkModalVisible(true)
        },500)
    }

    const getCarIcon = (size) => {
        if (size == 0) return require('./icons/SP.png')
        else if (size == 1) return require('./icons/MP.png')
        else return require('./icons/LP.png')
    }

    const msToTime = (duration) => {
        let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

        hours = (hours < 10) ? "0" + hours : hours
        minutes = (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds

        return parseInt(hours) + ":" + minutes + ":" + seconds
    }

    const timeToDecimal = (time) => {
        let hoursMinutes = time.split(/[.:]/);
        let hours = parseInt(hoursMinutes[0], 10);
        let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar style="light"/> 

            <View style={styles.container}>
                <View style={styles.header.panel}>
                    <Text style={styles.header.text}>Mall Parking</Text>
                    {
                        parkingMap.length > 0 ? (
                            <TouchableOpacity style={styles.header.btn} onPress={() => setModalVisible(true)}>
                                <Text style={styles.header.btnText}>Add Entry</Text>
                            </TouchableOpacity>
                        ) : ''
                    }
                    
                </View>
                    
                
                <View style={styles.body}>
                    <View style={styles.entryLabel.panel}>
                        <TouchableOpacity onPress={prevEntry}>
                            <Text style={[styles.entryLabel.angle]}>&#9001;</Text>
                        </TouchableOpacity>

                        <View style={styles.entryLabel.wrapper}>
                            <Text style={styles.entryLabel.text}>Entry {activeEntry+1}</Text>
                            <Text style={styles.entryLabel.text2}>
                                {(spaceAvailable != 12 && spaceAvailable != 0) ? `${spaceAvailable} space available` : 'All space are available'}
                            </Text>
                        </View>
                        
                        <TouchableOpacity onPress={nextEntry}>
                            <Text style={[styles.entryLabel.angle]}>&#9002;</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        <View style={styles.parking.container}>
                            <View style={styles.parking.wrapper}>
                                {   
                                    parkingMap.length > 0 ? (
                                        parkingMap[activeEntry].map((space, j) => {
                                            if (j < 6) {
                                                if (space.available == 0) {
                                                    return ( // if space is available
                                                        <View key={j} style={[styles.parking.space, styles.parking.topSpace]}>
                                                            <Text style={styles.parking.text}>Available</Text>
                                                            <Text style={styles.parking.label.left}>{space.name+'-'+space.size.label}</Text>
                                                        </View>
                                                    )
                                                } else {
                                                    let vehicle = vehicles.filter(vehicle => vehicle.pn == space.vehicle.plateNum)
                                                    return ( // if space is not available
                                                        <View key={j} style={[styles.parking.space, styles.parking.topSpace]}>
                                                            <TouchableOpacity style={styles.parking.image.btn} onPress={()=>spaceInfo(space)}>
                                                                <Image style={styles.parking.image.icon}
                                                                    source={getCarIcon(vehicle[0].size)}
                                                                />
                                                            </TouchableOpacity>
                                                            <Text style={styles.parking.label.left}>{space.name+'-'+space.size.label}</Text>
                                                        </View>
                                                    )
                                                }
                                            } else return('')
                                        })
                                    ) : ''
                                }
                            </View>

                            <View style={styles.parking.entrance}>
                                <Text style={styles.parking.entranceLabel}>----- Entrance -----</Text>
                                <TouchableOpacity style={styles.parking.button} onPress={() => setParkModalVisible(true)}>
                                    <Text style={styles.parking.btnText}>Park Car</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.parking.wrapper}>
                                {   
                                    parkingMap.length > 0 ? (
                                        parkingMap[activeEntry].map((space, j) => {
                                            if (j > 5) {
                                                if (space.available == 0) {
                                                    return ( // if space is available
                                                        <View key={j} style={[styles.parking.space, styles.parking.topSpace]}>
                                                            <Text style={styles.parking.text}>Available</Text>
                                                            <Text style={styles.parking.label.right}>{space.name+'-'+space.size.label}</Text>
                                                        </View>
                                                    )
                                                } else {
                                                    let vehicle = vehicles.filter(vehicle => vehicle.pn == space.vehicle.plateNum)
                                                    return ( // if space is not available
                                                        <View key={j} style={[styles.parking.space, styles.parking.topSpace]}>
                                                            <TouchableOpacity style={styles.parking.image.btn} onPress={()=>spaceInfo(space)}>
                                                                <Image style={styles.parking.image.icon}
                                                                    source={getCarIcon(vehicle[0].size)}
                                                                />
                                                            </TouchableOpacity>
                                                            <Text style={styles.parking.label.right}>{space.name+'-'+space.size.label}</Text>
                                                        </View>
                                                    )
                                                }
                                            } else return('')
                                        })
                                    ) : ''
                                }
                            </View>
                        </View>
                    }
                </View>
            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modal.container}>
                <View style={styles.modal.view}>
                    <Pressable
                        style={[styles.modal.button, styles.modal.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.modal.textStyle}>x</Text>
                    </Pressable>
                    <TextInput style={styles.modal.input}
                        onChangeText={val => setEntry(val)} 
                        keyboardType="numeric"
                        placeholder="Add another entry point"/>
                    <TouchableOpacity style={styles.modal.button}
                        onPress = {()=>initEntry()}
                    >
                        <Text style={styles.modal.textStyle}>Add</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={parkModalVisible}
                onRequestClose={() => {
                    setModalVisible(!parkModalVisible);
                }}>
                <View style={styles.modal.container}>
                <View style={styles.modal.view}>
                    <Pressable
                        style={[styles.modal.button, styles.modal.buttonClose]}
                        onPress={() => setParkModalVisible(!parkModalVisible)}>
                        <Text style={styles.modal.textStyle}>x</Text>
                    </Pressable>
                    <TextInput style={styles.modal.input} 
                        onChangeText={val => setPlateNum(val)} 
                        placeholder="Plate #"/>
                    <SelectList boxStyles={styles.modal.select}
                        setSelected={(val) => setParkingSize(val)} 
                        data={PSdata} 
                        save="value"
                        placeholder='Choose size'
                    />
                    <TouchableOpacity style={styles.modal.button}
                        onPress={park}
                    >
                        <Text style={styles.modal.textStyle}>Park</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={spaceModalVisible}
                onRequestClose={() => {
                    setModalVisible(!spaceModalVisible);
                }}>
                <View style={styles.modal.container}>
                <View style={styles.modal.view}>
                    <Pressable
                        style={[styles.modal.button, styles.modal.buttonClose]}
                        onPress={() => setSpaceModalVisible(!spaceModalVisible)}>
                        <Text style={styles.modal.textStyle}>x</Text>
                    </Pressable>
                    <Text style={styles.modal.h4}>{activeSpace.name + ' ($' + activeSpace.price + '/hr)\n'}</Text>
                    <Text style={styles.modal.textInfo}>Vehicle PN: {activeSpace.pn}</Text>
                    <Text style={styles.modal.textInfo}>Date: {activeSpace.date}</Text>
                    <Text style={styles.modal.textInfo}>Time start: {activeSpace.time.start!=undefined?activeSpace.time.start:''}</Text>
                    <Text style={styles.modal.textInfo}>Time consume: {activeSpace.ch}</Text>
                    <TouchableOpacity style={styles.modal.button}
                        onPress={unpark}
                    >
                        <Text style={styles.modal.textStyle}>Unpark</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={unParkModalVisible}
                onRequestClose={() => {
                    setModalVisible(!unParkModalVisible);
                }}>
                <View style={styles.modal.container}>
                    <View style={styles.modal.view}>
                        <Pressable
                            style={[styles.modal.button, styles.modal.buttonClose]}
                            onPress={() => setUnParkModalVisible(!unParkModalVisible)}>
                            <Text style={styles.modal.textStyle}>x</Text>
                        </Pressable>
                        <Text style={styles.modal.h4}>{activeSpace.name + ' ($' + activeSpace.price + '/hr)\n'}</Text>
                        <Text style={styles.modal.textInfo}>Plate Number: {activeSpace.pn}</Text>
                        <Text style={styles.modal.textInfo}>Date: {activeSpace.date}</Text>
                        <Text style={styles.modal.textInfo}>Time start: {activeSpace.time.start!=undefined?activeSpace.time.start:''}</Text>
                        <Text style={styles.modal.textInfo}>Time end: {activeSpace.time.end!=undefined?activeSpace.time.end:''}</Text>
                        <Text style={styles.modal.textInfo}>Time consume: {activeSpace.ch + '\n'}</Text>
                        <Text style={styles.modal.h5}>Total Hours: {activeSpace.totalHours}</Text>
                        <Text style={styles.modal.h5}>Payable Hours: ${activeSpace.payableHours}</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


