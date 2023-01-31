import { StyleSheet, Dimensions } from 'react-native'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const mainColor = '#161a25'
const headingColor = '#f6f9ff'
const labelColor = '#3a3e49'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: mainColor,
        alignItems: 'center',
        // justifyContent: 'center',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        width: windowWidth
    },

    header: {
        panel: {
            width: windowWidth, // 100%
            height: windowHeight - (windowHeight*.90), // 10%
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingVertical: 10,
        }, text: {
            color: headingColor,
            fontSize: 25,
        },
        btn: {
            position: 'absolute',
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: '#2196F3',
            right: 10,
            borderRadius: 5,
            bottom: 7
        },

        btnText: {
            color: '#fff',
            fontSize: 10
        }
    },

    body: {
        width: windowWidth, // 100%
        height: windowHeight - (windowHeight*.15), // 85%
        alignItems: 'center',
    },

    label: {
        fontSize: 17,
        color: labelColor
    },

    space: {
        marginTop: 150
    },

    button: {
        label: {
            fontSize: 15,
            color: labelColor
        },

        entry: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderWidth: 1.5,
            borderColor: labelColor,
            opacity: .5,
            marginTop: 10,
            borderRadius: 5
        }
    },

    modal: {
        container: {
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
        },

        view: {
            backgroundColor: 'white',
            width: windowWidth - (windowWidth*.4), // 60%
            borderRadius: 10,
            paddingVertical: 15,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            marginTop: windowHeight - (windowHeight*.75),
            position: 'relative'
        },

        button: {
            width: '87%',
            height: 30,
            backgroundColor: '#2196F3',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            marginTop: 10
        },

        buttonClose: {
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: -17,
            right: -7,
            width: 22,
            height: 22,
            backgroundColor: '#52879f',
        },

        textStyle: {
            color: 'white',
            fontWeight: 'bold',
            marginTop: -2
        },

        text: {
            marginBottom: 15,
            textAlign: 'center',
        },

        input: {
            height: 40,
            borderWidth: .3,
            padding: 10,
            borderRadius: 5,
            borderColor: labelColor,
            marginTop: 5,
            width: '87%',
        },

        select: {
            height: 40,
            borderWidth: .3,
            padding: 10,
            borderRadius: 5,
            borderColor: labelColor,
            marginTop: 5,
            width: windowWidth - (windowWidth*.475), // 60%
        },

        h4: {
            fontWeight: 'bold',
            fontSize: 18
        },

        h5: {
            fontWeight: 'bold',
            fontSize: 17
        },

        textInfo: {
            fontSize: 16
        },

        textWarning: {
            fontSize: 12,
            color: 'red',
            marginTop: 5
        }
    },

    entryLabel: {
        panel: {
            height: windowHeight - (windowHeight*.85), // 15%
            // backgroundColor: 'red',
            width: windowWidth,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },

        wrapper: {
            alignItems: 'center',
        },

        text: {
            color: headingColor,
            fontSize: 30,
            paddingHorizontal: 100
        },

        text2: {
            color: labelColor,
            fontSize: 17,
            marginTop: 5
        },

        angle: {
            fontSize: 25,
            color: labelColor,
            fontWeight: 'bold'
        },
    },

    parking: {
        container: {
            height: windowHeight - (windowHeight*.15), // 75%
            width: windowWidth,
            flexDirection: 'row'
        },

        entrance: {
            height: '100%',
            width: '40%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -80,
            position: 'relative'
        },

        entranceLabel: {
            color: labelColor,
            fontSize: 40,
            transform: [{rotate: '-90deg'}],
            width: 400,
            opacity: .2,
            textAlign: 'center'
        },

        button: {
            height: 70,
            width: 70,
            borderRadius: 35,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 5,
            backgroundColor: '#2196F3',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation:10,
        },

        btnText: {
            fontSize: 13,
            color: '#fff'
        },

        wrapper: {
            heihgt: '100%',
            width: '30%',
        },

        space: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '14%',
            borderBottomColor: labelColor,
            borderBottomWidth: 1,
            position: 'relative'
        },

        topSpace: {
            borderTopColor: labelColor,
            borderTopWidth: 1,
        },

        image: {
            btn: {
                position: 'absolute',
                zIndex: 9,
                width: '80%'
            },

            icon: {
                width: '100%'
            },
        },

        text: {
            color: labelColor,
            fontSize: 12
        },

        label: {
            left: {
                position: 'absolute',
                fontSize: 13,
                color: labelColor,
                bottom: 5,
                right: 5
            },
            right: {
                position: 'absolute',
                fontSize: 13,
                color: labelColor,
                bottom: 5,
                left: 5
            }
        }
    },
});

export default styles