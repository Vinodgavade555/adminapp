import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import CustomDataTable from '../../Constant/CustomDataTable';

const ongoingInterviews = [
  {
    candidateName: 'John Doe',
    interviewerName: 'Sarah Lee',
    position: 'Software Engineer',
    day: 'Wednesday',
    date: '2024-12-04',
    time: '10:00 AM',
    status: 'Initial Screening',
  },
  {
    candidateName: 'Jane Smith',
    interviewerName: 'Michael Johnson',
    position: 'Data Analyst',
    day: 'Thursday',
    date: '2024-12-05',
    time: '2:30 PM',
    status: 'Interview Scheduled',
  },
  {
    candidateName: 'Alex Brown',
    interviewerName: 'Emily Davis',
    position: 'Product Manager',
    day: 'Friday',
    date: '2024-12-06',
    time: '1:00 PM',
    status: 'In Progress',
  },
  {
    candidateName: 'Maria Garcia',
    interviewerName: 'James Wilson',
    position: 'UX Designer',
    day: 'Wednesday',
    date: '2024-12-04',
    time: '3:00 PM',
    status: 'Second Round',
  },
  {
    candidateName: 'Liam Nguyen',
    interviewerName: 'Olivia Martinez',
    position: 'Backend Developer',
    day: 'Thursday',
    date: '2024-12-05',
    time: '11:30 AM',
    status: 'Initial Screening',
  },
  {
    candidateName: 'Sophia Hernandez',
    interviewerName: 'David Clark',
    position: 'Frontend Developer',
    day: 'Tuesday',
    date: '2024-12-03',
    time: '9:00 AM',
    status: 'In Progress',
  },
  {
    candidateName: 'Ethan Perez',
    interviewerName: 'Jessica Adams',
    position: 'Database Administrator',
    day: 'Monday',
    date: '2024-12-02',
    time: '4:00 PM',
    status: 'Interview Scheduled',
  },
  {
    candidateName: 'Olivia Brown',
    interviewerName: 'Nathan White',
    position: 'Marketing Manager',
    day: 'Friday',
    date: '2024-12-06',
    time: '2:00 PM',
    status: 'Second Round',
  },
  {
    candidateName: 'Mason Carter',
    interviewerName: 'Emma Brooks',
    position: 'QA Engineer',
    day: 'Wednesday',
    date: '2024-12-04',
    time: '11:00 AM',
    status: 'Initial Screening',
  },
  {
    candidateName: 'Isabella Young',
    interviewerName: 'Ryan Scott',
    position: 'Business Analyst',
    day: 'Thursday',
    date: '2024-12-05',
    time: '1:30 PM',
    status: 'Interview Scheduled',
  },
  {
    candidateName: 'Noah Hill',
    interviewerName: 'Sophia Morgan',
    position: 'DevOps Engineer',
    day: 'Monday',
    date: '2024-12-02',
    time: '3:00 PM',
    status: 'In Progress',
  },
  {
    candidateName: 'Mia Ward',
    interviewerName: 'Benjamin Hall',
    position: 'HR Manager',
    day: 'Tuesday',
    date: '2024-12-03',
    time: '10:30 AM',
    status: 'Second Round',
  },
  {
    candidateName: 'Lucas King',
    interviewerName: 'Abigail Wood',
    position: 'Content Writer',
    day: 'Friday',
    date: '2024-12-06',
    time: '12:00 PM',
    status: 'Initial Screening',
  },
  {
    candidateName: 'Charlotte Adams',
    interviewerName: 'Elijah Wright',
    position: 'SEO Specialist',
    day: 'Thursday',
    date: '2024-12-05',
    time: '10:00 AM',
    status: 'Interview Scheduled',
  },
  {
    candidateName: 'Aiden Turner',
    interviewerName: 'Amelia Harris',
    position: 'UI Designer',
    day: 'Wednesday',
    date: '2024-12-04',
    time: '5:00 PM',
    status: 'Second Round',
  },
  {
    candidateName: 'Harper Cooper',
    interviewerName: 'Daniel Green',
    position: 'Data Scientist',
    day: 'Monday',
    date: '2024-12-02',
    time: '11:30 AM',
    status: 'In Progress',
  },
  {
    candidateName: 'Ella Kelly',
    interviewerName: 'Victoria Baker',
    position: 'IT Support',
    day: 'Tuesday',
    date: '2024-12-03',
    time: '8:30 AM',
    status: 'Initial Screening',
  },
  {
    candidateName: 'Michael Gray',
    interviewerName: 'Hannah Foster',
    position: 'Technical Writer',
    day: 'Thursday',
    date: '2024-12-05',
    time: '3:30 PM',
    status: 'Interview Scheduled',
  },
  {
    candidateName: 'Emily Walker',
    interviewerName: 'Matthew Gonzales',
    position: 'AI Engineer',
    day: 'Friday',
    date: '2024-12-06',
    time: '4:00 PM',
    status: 'Second Round',
  },
  {
    candidateName: 'Jackson Diaz',
    interviewerName: 'Chloe Rivera',
    position: 'Full Stack Developer',
    day: 'Wednesday',
    date: '2024-12-04',
    time: '2:30 PM',
    status: 'In Progress',
  },
];
const columns = [
  {header: 'Candidate Name', field: 'candidateName'},
  {header: 'Interviewer Name', field: 'interviewerName'},
  {header: 'Position', field: 'position'},
  {header: 'Day', field: 'day'},
  {header: 'Date', field: 'date'},
  {header: 'Time', field: 'time'},
  {header: 'Status', field: 'status'},
];
const PAGE_SIZE = 5;
const HomeScreen = () => {
  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  const startIndex = page * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const currentData = ongoingInterviews.slice(startIndex, endIndex);
  const numberOfPages = Math.ceil(ongoingInterviews.length / itemsPerPage);
  const paginatedData = ongoingInterviews.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );

  React.useEffect(() => {
    setPage(0); // Reset to the first page when itemsPerPage changes
  }, [itemsPerPage]);

  return (
    <View style={styles.container}>
      {/* Horizontal Scroll */}
      <View>
        <DataTable>
          <ScrollView horizontal>
            <View direction="row" style={styles.tableContainer}>
              <DataTable.Header style={styles.header}>
                <DataTable.Title textStyle={styles.headerText}>
                  Candidate
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText}>
                  Interviewer
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText}>
                  Position
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText}>
                  Day
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText}>
                  Date
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText}>
                  Time
                </DataTable.Title>
                <DataTable.Title textStyle={styles.headerText}>
                  Status
                </DataTable.Title>
              </DataTable.Header>

              {/* Paginated Rows */}
              {paginatedData.map((interview, index) => (
                <DataTable.Row key={index} style={styles.row}>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.candidateName}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.interviewerName}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.position}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.day}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.date}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.time}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {interview.status}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </View>
          </ScrollView>
          {/* Pagination */}
          {/* Pagination */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => setPage(prevPage => Math.max(prevPage - 1, 0))}
              style={[styles.paginationButton, {backgroundColor: '#2196F3'}]}>
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationText}>
              {startIndex + 1}-{Math.min(endIndex, ongoingInterviews.length)} of{' '}
              {ongoingInterviews.length}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setPage(prevPage =>
                  Math.min(
                    prevPage + 1,
                    Math.ceil(ongoingInterviews.length / PAGE_SIZE) - 1,
                  ),
                )
              }
              style={[styles.paginationButton, {backgroundColor: '#4CAF50'}]}>
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>
        </DataTable>
      </View>

      <View>
        <CustomDataTable columns={columns} data={ongoingInterviews} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    marginLeft: 10,
    marginTop: 10,
  },
  header: {
    backgroundColor: '#f4f4f4', // Light gray background for header
  },
  row: {
    // backgroundColor: 'red',
  },
  pagination: {
    backgroundColor: '#f8f8f8', // Custom background color for pagination
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  icon: {
    marginHorizontal: 10, // Space around icons
  },
  tableContainer: {},
  headerText: {
    width: 150,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold', // Bold text
    fontSize: 14, // Font size
    color: 'black', // Text color
  },
  cellText: {
    alignContent: 'center',
    width: 120,

    fontWeight: 'bold', // Bold text
    fontSize: 14, // Font size
    color: 'black', // Text color
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  paginationText: {
    fontSize: 16,
    color: '#808080',
  },
  paginationLabel: {
    fontSize: 14, // Adjust font size
    color: '#000000', // Dark gray color for text
    fontWeight: 'bold', // Bold text for the label
  },
});

export default HomeScreen;
