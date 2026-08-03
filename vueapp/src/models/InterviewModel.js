export default class InterviewModel
{
    constructor()
    {
        this.ContactInfo =
        {
            FullName: '',
            Email: '',
            Phone: '',
            PreferredContact: 'Email'
        }

        this.Education =
        {
            HighestDegree: '',
            SchoolName: '',
            GraduationYear: '',
            Certifications: ''
        }

        this.JobHistory =
        {
            MostRecentRole: '',
            MostRecentCompany: '',
            YearsExperience: '',
            KeyAchievement: ''
        }

        this.SkillsAndGoals =
        {
            TopSkills: [],
            InterestArea: '',
            CareerGoal: ''
        }
    }
}
