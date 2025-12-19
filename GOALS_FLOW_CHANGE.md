// Collaborative Goals Flow Update Summary
// 
// OLD FLOW:
// - createGoalInvitation: Created invitation only, waited for acceptance
// - acceptGoalInvitation: Created the goal when accepted
// - rejectGoalInvitation: Just marked invitation as rejected
//
// NEW FLOW (User Request):
// - createGoalInvitation: Create goal IMMEDIATELY with:
//     * Inviter as 'accepted' participant (green checkmark)
//     * Invitee as 'pending' participant (clock icon)
// - acceptGoalInvitation: Update invitee's participant status to 'accepted' (green checkmark)
// - rejectGoalInvitation: Update invitee's participant status to 'rejected' (red X)
