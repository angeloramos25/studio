const Styling = {
  colors: {
    primary: '#3D3D3D',
    gray: 'lightgray',
    lightgray: '#FAFAFA'
  },
  textfields: {
    line: {
      marginTop: 12,
      fontFamily: 'jost-light',
      fontSize: 16,
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    },
    floating: {
      marginTop: 4,
      fontFamily: 'jost-light',
      fontSize: 16,
    },
    box: {
      backgroundColor: 'white',
      borderRadius: 5,
      fontFamily: 'jost-light',
      fontSize: 16,
      padding: 6,
      marginTop: 6,
    }
  },
  containers: {
    wrapper: {
      width: '90%',
      height: '100%',
      alignSelf: 'center',
      marginTop: 100,
      backgroundColor: '#FAFAFA'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 10,
      width: '100%',
      padding: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    }
  },
  text: {
    label: {
      fontFamily: 'jost-light',
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 3,
    },
    xl: {
      fontFamily: 'jost-medium',
      fontSize: 20,
    },
    header: {
      fontFamily: 'jost-light',
      fontSize: 16,
      textTransform: 'uppercase',
      letterSpacing: 3,
    },
    subheader: {
      fontFamily: 'jost-light',
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 3,
    },
    body: {
      fontFamily: 'jost-light',
      fontSize: 14,
    }
  }
};

export default Styling;
