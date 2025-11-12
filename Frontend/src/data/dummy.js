export const adminStats = {
  totalVerified: 12456,
  activeUploaders: 2108,
  pending: 89,
  blocked: 15,
};

export const adminLeaderboard = [
  { rank: 1, name: "Olivia Rhye", points: 12450, uploads: 152, lastActive: "2 hours ago" },
  { rank: 2, name: "Phoenix Baker", points: 11980, uploads: 145, lastActive: "5 hours ago", flagged: true },
  { rank: 3, name: "Lana Steiner", points: 11500, uploads: 138, lastActive: "1 day ago" },
  { rank: 4, name: "Demi Wilkinson", points: 10820, uploads: 120, lastActive: "3 days ago" },
  { rank: 5, name: "Candice Wu", points: 10750, uploads: 118, lastActive: "2 days ago" },
];

export const securityLogs = [
  { ts: "Oct 28, 2023, 08:45 AM", type: "Login Failure", user: "student1@example.com", ip: "192.168.1.101", details: "Invalid Credentials" },
  { ts: "Oct 27, 2023, 03:20 PM", type: "Password Reset", user: "admin@example.com", ip: "203.0.113.45", details: "Reset Link Sent" },
  { ts: "Oct 27, 2023, 09:12 AM", type: "Login Failure", user: "user22@example.com", ip: "198.51.100.12", details: "Invalid Credentials" },
  { ts: "Oct 26, 2023, 11:55 PM", type: "Password Reset", user: "student5@example.com", ip: "10.0.0.5", details: "Reset Link Sent" },
  { ts: "Oct 26, 2023, 01:10 PM", type: "Login Failure", user: "guestuser@example.com", ip: "172.16.0.10", details: "Account Locked" },
];

export const branches = [
  { id: 101, name: "Computer Science", created: "2023-10-26" },
  { id: 102, name: "Mechanical Engineering", created: "2023-10-25" },
  { id: 103, name: "Electrical Engineering", created: "2023-10-24" },
  { id: 104, name: "Civil Engineering", created: "2023-10-23" },
];
