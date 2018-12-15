# CabX
by: Adiza Awwal(asa2201), Clyde Bazile(cb3150), Xiao Lim(xl2669), Benedikt Schifferer(bds2141)

CabX is a ride-hailing service aggregator, developed as a semester-long project for the Fall 2018 session of COMS 4156 Advanced Software Engineering at Columbia University. The course was taught by Professor Gail Kaiser and our group mentor was Kiran Ramesh.

With CabX, you can input your origin and destination addresses and the app will return a list of available ride-hailing services that you can call to get to your destination.


How to Build
-------
You have two choices for the GUI:
1. Install [Expo](https://expo.io/)
2. (Optional) Install [Xcode](https://developer.apple.com/xcode/) — note that Xcode is only available to Mac users

Pull the repository and navigate to the frontend folder in your Terminal. Run ``npm install `` to ensure you have all required dependencies for the app. To start the app, run ``npm start``. 

If you only have Expo downloaded, you can load the app on your mobile device by pointing your camera at the QR code and tapping the banner link. It will redirect you to Expo, where after the JavaScript bundle has been downloaded, you can begin navigating through the app.

If you downloaded Xcode, you can choose to display the app on the Xcode Simulator by pressing `i` in the Terminal.


How to Use
-------

### Login/Sign up
If you're a new user, you have to sign up for an account. Click the ``sign up`` button and input a valid email address as well as matching passwords in the password fields. Once you sign up, you'll receive an email at the provided email address with a verification link. Your account will be valid and you will be able to access the CabX app after you click on the link.

Existing users can login with their email and password to access the app.

### Forgot Your Password?
If you forgot your password, simply click on the ``forgot my password`` button and input the email address associated with your account. We will email you a reset link where you can reset your password.

### Find Rides
Input your starting point and destination addresses into the input area on the top of the app. Once you select the correct address, click the search button (magnifying glass icon) to get a list of available ride-hailing services. 

### Sort Rides by Price or ETA
To sort the list by price, click on the money tab. To sort by estimated time of arrival, click on the time tab.

### Search History
To access your search history, you can click the dropdown buttons located by the input area. This will pull up your past searches that you can click on to populate either search bars.



How to Test
-------

From the root directory, you can run the following pre-commit tests:

1. Unit testing with mocha. To run, type:
```
npm run test
```

2. Style checking with eslint
```
npm run eslint
```

3. Coverage checking with istanbul and mocha
``` 
npm run coverage
```

If any of these test scripts returns an error, then changes will not be committed to the repository. The test coverage is set to 70% for statements, lines and functions.