# FluiMap Project Guide

## Project Overview

FluiMap is a web application designed to help managers assess team dynamics, engagement, and relationships through structured surveys. The system collects responses from team members via email-distributed surveys, processes this data through an R statistical model accessible via a web API.

## Key Objectives

- Provide managers with tools to understand team dynamics
- Simplify the survey distribution and collection process
- Generate meaningful insights from team responses
- Present data visualizations that highlight team relationships

## User Roles

### Manager

The primary user who administers surveys and analyzes results. Managers are the only users who need to authenticate to the system trough Clerk.

### Team Member

Individuals who receive survey links via email and provide responses. They do not need to create accounts or authenticate to complete surveys.

## Core Workflows

### Manager Workflow

1. **Authentication**

   - Register and sign in to the platform with Clerk

2. **Team Management**

   - Add team members individually by email
   - Upload CSV files to bulk add team members
   - View and manage team roster

3. **Survey Administration**

   - Launch surveys to the team
   - Set survey completion deadlines
   - Monitor real-time response rates
   - Close surveys and generate results

4. **Results Management**
   - View analytics and visualizations

### Team Member Workflow

1. **Survey Completion**

   - Receive unique survey link via email
   - Complete the structured survey questions
   - Submit responses and receive confirmation

## System Components

### Authentication System

- Secure login for managers
- Password protection for results dashboards
- No authentication required for survey completion

### Survey Management

- Email distribution system with Resend and React Email
- Unique link generation
- Response tracking
- Deadline enforcement

### Data Processing Pipeline

- Response collection and storage
- Integration with R statistical model via web API
- Generation of metrics and insights
- Creation of visualization data

### Results Dashboard

- Interactive data visualizations
- Team relationship network graph
- Engagement and communication metrics
- Historical trend analysis

## Data Architecture

### Analytics Data

- Relationship strength metrics
- Team dynamic insights

### Visualization Data

- Time-series data for trend analysis
- Network graph data for relationship visualization

## Technical Approach

### Frontend

- Responsive web application accessible on all devices
- UI components with ShadcnUI and Tailwind
- Real-time dashboard updates for managers
- Simple, intuitive survey forms for team members
- acessible forms with Reac Hook Forms and ShadcnUI
- Interactive data visualizations

### Backend

- Email notification system with Resend and React Email
- Integration via web API for R model
- Authentication and access control with Clerk

### R Model Integration

- Data transformation for model input
- comunication over HTTP

### Data Storage

- Secure storage of survey responses
- Real-time database for live updates with mongodb
- Query optimization for dashboard performance

## Key Features

### For Managers

- CSV upload for bulk team member addition
- Real-time response rate monitoring
- Email automation for survey distribution

### For Team Members

- No account creation required
- Mobile-friendly survey interface
- Secure feedback submission

### For Analysis

- Team relationship network visualization
- Engagement metrics with trend analysis
- Comparative analytics (if historical data available)

## Security Considerations

- Secure unique links for survey access
- Password protection for results dashboard

## Implementation Considerations

- Prioritize user experience for both managers and team members
- Ensure mobile compatibility for survey completion

This guide provides a comprehensive overview of the Team Analyzer project, including workflows, components, and technical approach, to assist in understanding and implementing the system.
