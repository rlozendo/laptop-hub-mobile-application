import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

const Styles = StyleSheet.create({

    flexLogin: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    flex2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 16,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    logoLogin: {

        marginLeft: 'auto',
        marginRight: 'auto',
    },
    text1: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center'
    },
    inputUser: {
        backgroundColor: '#fff',
        fontSize: 14,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderColor: '#787878',
        borderWidth: 1,
        textAlign: 'center',
        marginBottom: 8,
        color: '#000'
    },
    inputUserHelper: {
        marginBottom: 0,
        marginTop: 8
    },
    inputUserHelper2: {
        marginBottom: 0,
        marginTop: 0
    },
    removeMarginBottom: {
        marginBottom: '0 !important'
    },
    inputPass: {
        backgroundColor: '#fff',
        fontSize: 14,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderColor: '#787878',
        borderWidth: 1,
        textAlign: 'center',
        color: '#000'
    },
    viewLogin2: {
        width: '90%',

    },
    viewLogin3: {
        width: '100%',
        flexDirection: 'row'
    },
    spinnerContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    btnHandlers: {
        flexDirection: 'row', // Ensures that its children are aligned horizontally
        justifyContent: 'space-between', // Adds space between the two groups of buttons
        //paddingHorizontal: 10, // Optional padding to adjust spacing
        width: '100%',
        marginTop: 9

    },
    buttonReg: {
        marginTop: 0,
        backgroundColor: '#8ca5cf',
        marginBottom: 0,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        paddingTop: 20,
        paddingBottom: 20,
        width: '49%',
        marginLeft: '0',
        marginRight: 'auto',
    },
    buttonLog: {
        backgroundColor: '#8ca5cf',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        paddingTop: 20,
        paddingBottom: 20,
        width: '49%',
        marginLeft: 'auto',
        marginRight: '0'
    },
    leftBtn: {
        marginTop: 0,
        backgroundColor: '#8ca5cf',
        marginBottom: 0,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        paddingTop: 20,
        paddingBottom: 20,
        width: '49%',
        marginLeft: '0',
        marginRight: 'auto',
    },
    rightBtn: {
        backgroundColor: '#8ca5cf',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        paddingTop: 20,
        paddingBottom: 20,
        width: '49%',
        marginLeft: 'auto',
        marginRight: '0'
    },
    blockBtn: {
        backgroundColor: '#8ca5cf',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%',
        marginLeft: 'auto',
        marginRight: '0',
        marginBottom: 20,
        marginTop: -10
    },
    txtBtn: {
        textTransform: 'capitalize',
        textAlign: 'center',
        fontSize: 13,
        color: '#fff',
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    scrollView1: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        position: 'relative',
        top: 0,
        left: 0
    },
    dashHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#7b7b7b',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 62,
        backgroundColor: '#fff',
        padding: 16,
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 2, // Adjust the shadowRadius to control the shadow spread    
        flexDirection: 'row', // Arrange children horizontally
        justifyContent: 'space-between', // Space evenly between children
        paddingHorizontal: 16, // Adjust padding as needed
    },
    headerLogo: {},
    logOut: {
        position: 'absolute',
        right: 8,
        top: 12,
        color: '#50d9ce'
    },
    backbtn: {
        position: 'absolute',
        right: 8,
        top: 12,
        color: '#50d9ce'
    },
    backbtnIcon: {
        position: 'absolute',
        right: 68,
        top: 12,
        color: '#8ca5cf'
    },
    logOutIcon: {
        position: 'absolute',
        right: 8,
        top: 10,
        color: '#8ca5cf'
    },
    dashFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 2, // Adjust the shadowRadius to control the shadow spread        
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 15,
        paddingBottom: 15,
        zIndex: 2
    },
    linksBot: {
        color: '#8ca5cf'
    },
    linksBotLink: {
        color: '#50d9ce'
    },

    container: {
        height: '100%',
        paddingTop: 80,
        paddingBottom: 80,
        paddingHorizontal: 20
    },
    para: {
        fontSize: 12,
        marginBottom: 16,
        marginTop: 10
    },
    paraJustify: {
        textAlign: 'justify'
    },
    para2: {
        fontSize: 12,
        marginBottom: 16,
        marginTop: 10,
        textAlign: 'justify'
    },
    picker: {
        color: '#000',
        backgroundColor: 'red',
        flex: 1
    },
    buttonDash: {
        backgroundColor: '#8ca5cf',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%',
        marginLeft: 'auto',
        marginRight: '0',
        marginBottom: 20,
        marginTop: -10
    },
    dummyImg: {
        width: 100,
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 100
    },
    dummyImg2: {
        width: 24,
        height: 24,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 0,
        marginTop: 18,
        borderRadius: 100,
        position: 'absolute',
        right: 46,
        top: 3
    },
    centerThis: {
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 20
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    inputUser2: {
        backgroundColor: '#fff',
        fontSize: 14,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderColor: '#787878',
        borderWidth: 1,
        textAlign: 'center',
        marginBottom: 0,
        color: '#000'
    },
    contactSubject: {
        backgroundColor: '#fff',
        fontSize: 14,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderColor: '#787878',
        borderWidth: 1,
        textAlign: 'center',
        marginBottom: 0,
        color: '#000'
    },
    mb5: {
        marginBottom: 8
    },
    spaceTop: {
        marginTop: 0
    },
    mt8: {
        marginTop: 8
    },
    buttonDash2: {
        marginTop: 20,
        marginBottom: 20
    },
    bikeHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 0,
        marginTop: 30,
        color: '#000',
        textTransform: 'uppercase'
    },
    brandsHeader: {
        fontWeight: 'normal',
        fontSize: 12,
        marginBottom: 0,
        marginTop: 20,
        color: '#000',
        textAlign: 'justify'
    },
    productName: {
        textAlign: 'center',
        paddingVertical: '16',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
        marginTop: 12
    },
    brandName: {
        textAlign: 'center',
        paddingVertical: '16',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
        marginTop: 12,
        textTransform: 'uppercase'
    },
    productCategory: {
        fontSize: 12,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 4,
        marginTop: 5
    },
    imageBike: {
        width: 266,
        height: 140,
        maxWidth: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    productImgHolder: {
        padding: 30,
        borderColor: '#787878',
        borderWidth: 1,
        borderRadius: 7,
        width: 266,
        height: 187,
        display: 'table',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    productWrapper: {
        marginTop: 60
    },
    brandWrapper: {
        marginTop: 50
    },
    viewPager: {
        flex: 1,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    productTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 16,
        textAlign: 'center',
        lineHeight: 26
    },
    sliderWrapper: {
        padding: 30,
        borderColor: '#787878',
        borderWidth: 1,
        borderRadius: 7,
        width: 266,
        height: 187,
        display: 'table',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    galleryTitle: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'normal',
        textAlign: 'center',
        lineHeight: 16
    },
    heading: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        textTransform: 'uppercase'
    },
    subHeading: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16
    },
    subHeading2: {
        fontWeight: 'bold',
        marginTop: 5
    },
    infoWrapper: {
        marginBottom: 16
    },
    mb: {
        marginBottom: 16
    },
    mbLast: { marginBottom: 25 },
    formContainer: {
        marginBottom: 16
    },
    contactTextarea: {
        backgroundColor: '#fff',
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderColor: '#787878',
        borderWidth: 1,
        textAlign: 'left',
        marginTop: 0,
        marginBottom: 0,
        textAlignVertical: 'top',
        height: 100,
        textAlign: 'center'
    },
    centered: {
        textAlign: 'center'
    },
    mt5: {
        marginTop: 5
    },
    mt8: {
        marginTop: 16
    },
    mt0: {
        marginTop: 0
    },
    fieldHeding: {
        textAlign: 'center',
        marginTop: 16,
        fontWeight: 'bold'
    },
    boldThis: {
        fontWeight: 'bold'
    },
    boldThisHelper: {
        textAlign: 'center',
        marginVertical: 20
    }
});

export default Styles;