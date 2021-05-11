const Styling = {
  colors: {
    primary: '#003CF8',
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
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      fontFamily: 'jost-light',
      fontSize: 16,
      padding: 2,
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
      fontFamily: 'jost-medium',
      fontSize: 16,
    },
    subheader: {
      fontFamily: 'jost-medium',
      fontSize: 14,
    },
    body: {
      fontFamily: 'jost-light',
      fontSize: 14,
    }
  }
};

export default Styling;
