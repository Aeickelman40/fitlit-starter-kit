var infoCard = document.querySelector('.info-card');
var welcomeMessage = document.querySelector('.welcome-message');
var compareStepDisplay = document.querySelector('.compare-steps');
var friendsDisplay = document.querySelector('.friends');
var hydrationAverageDisplay = document.querySelector('.hydration-average');
var hydrationDailyDisplay = document.querySelector('.hydration-daily');
var hydrationWeeklyDisplay = document.querySelector('.hydration-weekly');
var sleepDailyDisplay = document.querySelector('.today-sleep-data');
var sleepWeeklyDisplay = document.querySelector('.sleep-weekly');
var sleepAverageDisplay = document.querySelector('.sleep-average');
var sleepWorstDisplay = document.querySelector('.sleep-worst');
var topClimberDisplay = document.querySelector('.top-climber');
var weeklyMinutesActiveDisplay = document.querySelector('.weekly-minutes-active');
var weeklyFlightOfStairsDisplay = document.querySelector('.weekly-flight-of-stairs')
var weeklyStepCountDisplay = document.querySelector('.weekly-step-count');
var numMilesOnDayDisplay = document.querySelector('.num-miles-on-day');
var numActiveMinutesOnDayDisplay = document.querySelector('.num-active-minutes-on-day');
var numStepsOnDayDisplay = document.querySelector('.num-steps-on-day');
var compareActivityDisplay = document.querySelector('.user-vs-average')

let user = new User()
let userRepo = new UserRepository(userData);
let hydration = new Hydration(hydrationData);
let sleep = new Sleep(sleepData);
let activity = new Activity(activityData);
const date = "2019/09/22";

window.onload = displayData()

// Refactor based on data being displayed (smaller helper functions)
function displayData() {
  makeUser();
  displayUserInfo();
  welcomeMessageOnLoad();
  populateFriends();
  compareStepGoals();
  displayAverageHydation();
  displayDailyHydration();
  displayWeeklyHydration();
  displayDailySleep();
  displayWeeklySleep();
  displayAverageSleep();
  displayBadSleeper();
  displayNumStepsOnDay();
  displayNumMinutesActiveOnDay();
  displayNumMilesOnDay();
  displayActivityComparedToAllUsers();
}

function makeUser() {
  let randomUser = Math.floor(Math.random() * userData.length);
  user = new User(userData[randomUser])
}

function displayUserInfo() {
  infoCard.innerHTML = 
    `<p>${user.name}</p>
    <p>${user.address}</p>
    <p>${user.email}</p>
    <p>Your stride is: ${user.strideLength} feet.</p>
    <p>Your step goal for today is: ${user.dailyStepGoal}.</p>`
}

function welcomeMessageOnLoad() {
  welcomeMessage.innerText = `Welcome to Fitlit ${user.returnFirstName()}!`
}

function populateFriends() {
  let friendsObjects = []
  user.friends.forEach(friend => {
    friendsObjects.push(userRepo.getDataById(friend)); 
  })
  let friendsNames = friendsObjects.map(friend => {
    return friendsDisplay.innerHTML = `<p>${friend.name}</p>`
  })
  return friendsDisplay.insertAdjacentHTML('beforeend', 
    `${friendsNames.join('')}`)  
}

function compareStepGoals() {
  let averageStepGoal = userRepo.averageUserStepGoal();
  let stepDifference = averageStepGoal - user.dailyStepGoal;
  let positiveDifference = Math.abs(stepDifference);
  if (averageStepGoal > user.dailyStepGoal) {
    compareStepDisplay.innerHTML = `<p>Your step goal of ${user.dailyStepGoal} is ${positiveDifference} steps behind everyone!</p>`
  } else {
    compareStepDisplay.innerHTML = `<p>Nice work, your step goal of ${user.dailyStepGoal} is ${positiveDifference} steps ahead of the game!</p>`
  }
}

function displayAverageHydation() {
  let userHydration = hydration.getHydrationDataById(user.id)
  let averageHydration = hydration.allTimeHydration(user.id) / userHydration.length
  hydrationAverageDisplay.insertAdjacentHTML('beforeend', 
    `<p>You typically drink ${averageHydration} ounces of water per day.</p>`)
}

function displayDailyHydration() {
  let dailyHydration = hydration.fluidConsumedForDay(date, user.id);
  hydrationDailyDisplay.insertAdjacentHTML('beforeend', 
    `<p>Today you have had ${dailyHydration} ounces of water!</p>`);
}

function displayWeeklyHydration() {
  let weeklyHydration = hydration.fluidConsumedForAWeek(date, user.id) 
  hydrationWeeklyDisplay.insertAdjacentHTML('beforeend', 
    `<p>Yesterday you had ${weeklyHydration[5]} ounces of water,</p>
    <p>2 days ago you had ${weeklyHydration[4]} ounces of water,</p>
    <p>3 days ago you had ${weeklyHydration[3]} ounces of water,</p>
    <p>4 days ago you had ${weeklyHydration[2]} ounces of water,</p>
    <p>5 days ago you had ${weeklyHydration[1]} ounces of water,</p>
    <p>6 days ago you had ${weeklyHydration[0]} ounces of water</p>`) 
}

function displayDailySleep() {
  let dailyHoursSlept = sleep.hoursSleptOnDay(date, user.id);
  let dailySleepQuality = sleep.sleepQualityOnDay(date, user.id);
  sleepDailyDisplay.insertAdjacentHTML('beforeend', 
    `<p>Wake up! You have slept ${dailyHoursSlept} hours today, your quality was a ${dailySleepQuality} out of 5</p>`)
}

function displayWeeklySleep() {
  let weeklySleepHours = sleep.hoursSleptEachDayInAWeek(date, user.id)
  sleepWeeklyDisplay.insertAdjacentHTML('beforeend', 
    `<p>Yesterday you slept ${weeklySleepHours[5]} hours,</p>
  <p>2 days ago you slept ${weeklySleepHours[4]} hours,</p>
  <p>3 days ago you slept ${weeklySleepHours[3]} hours,</p>
  <p>4 days ago you slept ${weeklySleepHours[2]} hours,</p>
  <p>5 days ago you slept ${weeklySleepHours[1]} hours,</p>
  <p>6 days ago you slept ${weeklySleepHours[0]} hours</p>`)
}

function displayAverageSleep() {
  let averageSleepQuality = sleep.avgSleepQualityAllTime(user.id);
  let averageHoursSlept = sleep.avgSleptPerDay(user.id);
  sleepAverageDisplay.insertAdjacentHTML('beforeend', 
    `<p>You normal sleep average is ${averageSleepQuality} out of 5, you typically sleep for ${averageHoursSlept} hours.</p>`)
}

function displayBadSleeper() {
  let worstSleeper = sleep.findUsersWhoNeedNap(date);
  let worstSleeperName = userRepo.getDataById(worstSleeper.userID)
  sleepWorstDisplay.insertAdjacentHTML('beforeend', 
    `<p> Tell ${worstSleeperName.name} to take a nap! They only slept ${worstSleeper.hoursSlept} hours last night!`)
}

function displayNumStepsOnDay() {
  let userActivityData = activity.getActivityDataById(user.id)
  let dayActivityData = userActivityData.filter(activityInfo => activityInfo.date === date)
  numStepsOnDayDisplay.innerHTML = `You have walked ${dayActivityData[0].numSteps} steps today.`
}

function displayNumMinutesActiveOnDay() {
  let userActivityData = activity.getActivityDataById(user.id)
  let dayActivityData = userActivityData.filter(activityInfo => activityInfo.date === date)
  numActiveMinutesOnDayDisplay.innerHTML = `You have had ${dayActivityData[0].minutesActive} minutes active today.`
} 

function displayNumMilesOnDay() {
  numMilesOnDayDisplay.innerHTML = `You have walked ${activity.milesWalked(user.id, date, userRepo)} miles today`
}

function displayActivityComparedToAllUsers() {
  let averageNumStepsAllUsers = activity.averageAllUserActivity(date, 'numSteps');
  let averageStairsAllUsers = activity.averageAllUserActivity(date, 'flightsOfStairs');
  let averageMinutesActiveAllUsers = activity.averageAllUserActivity(date, 'minutesActive');
  let userMinutesActive = activity.activityOnDay(user.id, date, 'minutesActive');
  let userFlightsOfStairs = activity.activityOnDay(user.id, date, 'flightsOfStairs');
  let userNumSteps = activity.activityOnDay(user.id, date, 'numSteps')
  if(userNumSteps > averageNumStepsAllUsers) {
     compareActivityDisplay.insertAdjacentHTML('beforeend', 
    `You're doing great! You are ${userNumSteps - averageNumStepsAllUsers} steps ahead of everyone!`)
  } else if (userNumSteps < averageNumStepsAllUsers) {
    compareActivityDisplay.insertAdjacentHTML('beforeend', 
    `You are ${averageNumStepsAllUsers - userNumSteps} steps behind everyone! Step it up!`)
  }
  if(userFlightsOfStairs > averageStairsAllUsers) {
       compareActivityDisplay.insertAdjacentHTML('beforeend', 
    `You're doing great! You are ${userFlightsOfStairs - averageStairsAllUsers} flights ahead of everyone!`)
  } else if (userFlightsOfStairs < averageStairsAllUsers) {
     compareActivityDisplay.insertAdjacentHTML('beforeend', 
    `You are ${averageStairsAllUsers - userFlightsOfStairs} flights behind everyone! Step it up!`)
  } 
  if(userMinutesActive > averageMinutesActiveAllUsers) {
     compareActivityDisplay.insertAdjacentHTML('beforeend', 
    `You're doing great! You are ${userMinutesActive - averageMinutesActiveAllUsers} active minutes ahead of everyone!`)
  } else if (userMinutesActive < averageMinutesActiveAllUsers) {
     compareActivityDisplay.insertAdjacentHTML('beforeend', 
    `You are ${averageMinutesActiveAllUsers - userMinutesActive} active minutes behind everyone! Step it up!`)
  }

  function displayWeeklyActivityCount() {
    let stepsAverage = activity.averageUserActivityForWeek(user.id, date, 'numSteps');
    let flightsOfStairsAverage = activity.averageUserActivityForWeek(user.id, date, 'flightsOfStairs');
    let minutesActiveAverage = activity.averageUserActivityForWeek(user.id, date, 'minutesActive');

  }
}