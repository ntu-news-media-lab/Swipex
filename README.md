# SwipeX

SwipeX is a mobile web feature that allows users to read the news more productively by providing bite-sized summaries that are easily comprehensible, encouraging them to read more stories and widely while also reading stories they enjoy.

## Table of Contents:
1. [Introduction](https://github.com/lihaan/Swipex#1-introduction)
2. [Requirements](https://github.com/lihaan/Swipex#2-requirements)
3. [Setup](https://github.com/lihaan/Swipex#3-setup)
4. [Usage](https://github.com/lihaan/Swipex#4-usage)
5. [Future Iterations](https://github.com/lihaan/Swipex#5-future-iterations)
6. [Acknowledgements](https://github.com/lihaan/Swipex#6-acknowledgements)
7. [Team](https://github.com/lihaan/Swipex#7-team)


## 1. Introduction
SwipeX aims to: 
1. Pique curiosity – it delivers news in summaries to make news reading more productive. 
2. Personalise – it learns the reader’s reading habits and preferred news stories and feeds the user content that interests them.


## 2. Requirements
##### Front-end React app
- Nodejs
- Yarn or npm package manager
- A browser that supports localstorage

##### Backend Django server
- Python Package Installer (https://pypi.org/project/pip/)

## 3. Setup
1. Download and unzip this code repository into your desired file directory
2. Open the command line and navigate to the root of the repository

##### Front-end React app
1. To navigate to the front-end React project:
> cd swipex
2. To install Nodejs dependencies:
> npm install
3. To launch React app:
> npm start

##### Backend Django server
6. To navigate to the back-end Django project: > cd backend/today
7. To install Python dependencies:
 > pip install django <br>
 > pip install Django-cors-headers <br>
 > pip install djangorestframework
8. To launch the Django server:
> python manage.py runserver



## 4. Usage
##### Watch a demo of SwipeX
[![SwipeX Demo](https://img.youtube.com/vi/C1pb9VR46q0/0.jpg)](https://youtu.be/C1pb9VR46q0 "SwipeX Demo")

#### Key Features
##### User onboarding
User taps on the SwipeX bubble and is introduced to a quick tutorial. The 3 tutorial cards provide information about the functions of SwipeX.
##### Card swiping
Each piece of news is displayed on a card. Users can swipe left to read the next card, swipe right to go back to the previous one, and swipe up to read the full article if interested.
##### Bite-sized summary
A short summary of news is provided on each card that enables users to capture the most essential information in a short time.
##### Personalisation
After spending sufficient time on SwipeX, our tool learns the preferences of the user. The tool will start to provide news cards that potentially interest the user. 
##### Metrics
SwipeX will collect and store certain types of non-sensitive user data. The number of unique users a day and the number of new users a day can be measured for reach and growth. The number of users who swiped more than about 7 cards and the number of returning users within their first week of use are measured to determine the retention rate. Time spent per card collected to personalise the news stories better.

## 5. Future Iterations
We hope to improve the product through further iterations:
+ A save/bookmark function should readers want to read the articles more in-depth at a later time. 
+ Editor’s Pick or Popular Read category with curated articles of importance to encourage users to read more widely. 
+ Introduce a free subscription or sign-in model to push notifications and collect more data to curate more personalised articles 
+ Sophisticated machine learning that will recommend articles to users based on other users of similar reading habits


## 6. Acknowledgements
Ms Jessica Tan and Miss Joan Kelly for their guidance throughout the News Media Lab course.

Our news partners, Amanda Eber and Bryna Sim, from TODAYonline for their continuous support and valuable feedback.

Our industry mentor Janie Octia from CrowdTangle @ Facebook for her expert guidance.

Users from our research process, for providing us with insightful comments and feedback.

## 7. Team
- Journalists: Brandon Alexius Chia, Heather Ho, Tiffany Tan (leader)
- Designers: Bella Dai, Lin Sining
- Developers: Ong Li Han, Koh Luo Hao, Xue Fuguo