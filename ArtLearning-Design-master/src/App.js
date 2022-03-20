import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//Utility Files
import NoMatch from './components/NoMatch';
import PrivateRoute from './components/PrivateRoute';
import file from './components/FileUploadButton';


import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';

import TeacherDashboard from './components/teacher/TeacherDashboard'
import AddCourse from './components/teacher/AddCourse';
import ViewMyCourses from './components/teacher/MyCourses';
import EditCourse from './components/teacher/EditCourse';
import Resources from './components/teacher/Resource';
import ViewEnrollment from './components/teacher/ViewEnrollment';
import PlayResource from './components/teacher/PlayResource';

import CourseDetail from './components/CourseInfo';

import MyEnrollments from './components/student/MyEnrollment';
import ViewCourseResource from './components/student/ViewCourse';

import communityForum from './components/CommunityForum'
import ViewReplies from './components/CommunityReplies';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Registration} />
        <Route exact path='/file' component={file} />
        <PrivateRoute exact path='/teacher-dashboard' component={TeacherDashboard}></PrivateRoute>
        <PrivateRoute path='/addCourse' component={AddCourse}></PrivateRoute>
        <PrivateRoute path='/viewMyCourses' component={ViewMyCourses}></PrivateRoute>
        <PrivateRoute path='/editCourse/:id' component={EditCourse}></PrivateRoute>
        <PrivateRoute path='/addResource/:id' component={Resources}></PrivateRoute>
        <PrivateRoute path='/viewEnrollments/:id' component={ViewEnrollment}></PrivateRoute>

        <Route path='/playResource/:id' component={PlayResource}></Route>

        <Route path='/courseDetails/:id' component={CourseDetail} />

        <PrivateRoute path='/myEnrollments' component={MyEnrollments}></PrivateRoute>
        <PrivateRoute path='/viewResources/:id' component={ViewCourseResource}></PrivateRoute>

        <PrivateRoute path='/communityForum' component={communityForum}></PrivateRoute>
        <PrivateRoute path='/viewReplies/:id' component={ViewReplies}></PrivateRoute>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
