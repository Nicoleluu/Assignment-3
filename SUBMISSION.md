# Assignment · Engagement Component with Firebase

## Website

[View the interactive website](https://nicoleluu.github.io/Assignment-3/#poll)

## Screenshot

![Where Would You Sit Firebase poll](images/firebase-poll-update.jpg)

## How I might use this approach

This anonymous poll adds a community perspective to my chair study. Asking visitors where they would place the DCM helps compare the chair’s history as a practical object with its later status as a collectible design icon. Firebase Realtime Database aggregates each choice and immediately returns the shared results, so the component can reveal how the audience collectively imagines the chair in use.

I intentionally collect only the four aggregate vote counts—not names, emails, locations, or demographic information. The one-vote marker stays in the visitor’s own browser and is not sent to Firebase. This makes the results lower-risk, but they are still a self-selected sample rather than representative research. If the project grew, I would publish a retention policy, restrict database writes with stronger validation and authentication, and avoid combining these responses with individual profiles.
