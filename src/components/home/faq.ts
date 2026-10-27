import { UNIVERSITY, type Locale } from "@/lib/site";

/** Home-page FAQ. The same items feed the visible accordion and the FAQPage JSON-LD. */
export function homeFaq(locale: Locale): { q: string; a: string }[] {
  if (locale === "en") {
    return [
      {
        q: "What is the difference between bachelor's and master's programmes?",
        a: "A bachelor's degree is the first cycle of higher education and gives the core and professional grounding in a field. A master's degree is the second cycle: deeper specialisation and research training for graduates who already hold a bachelor's degree. The site lists each level's programmes separately.",
      },
      {
        q: "Where can I see a programme's curriculum?",
        a: "Open the programme and choose the “Curriculum” tab: every subject is listed with its credits, semester and status. Each subject has its own page with the syllabus, the topic plan and the reading list.",
      },
      {
        q: "What are PLOs and CLOs?",
        a: "Programme learning outcomes (PLOs) are what a graduate is expected to know and be able to do on completing the programme. Course learning outcomes (CLOs) are what a student should achieve by the end of each subject. The CLO↔PLO matrix shows which programme outcome each subject contributes to.",
      },
      {
        q: "Which languages is the information available in?",
        a: "The site is in Azerbaijani and English — switch with the AZ / EN control in the header. Content that has not been translated into English yet is shown in Azerbaijani.",
      },
      {
        q: "How do I browse by faculty or department?",
        a: "The “Faculties” section lists each faculty's departments, and every department page lists all of its programmes. The catalogue can also be filtered by faculty.",
      },
      {
        q: "Who do I contact about admissions or other questions?",
        a: `The university's contact details are on the Contact page: ${UNIVERSITY.email}, (+994 12) 538-33-83. The latest admission rules are published on the university's official website, aztu.edu.az.`,
      },
    ];
  }
  return [
    {
      q: "Bakalavr və magistr təhsili arasında fərq nədir?",
      a: "Bakalavriat ali təhsilin birinci pilləsidir və ixtisas üzrə fundamental və peşə hazırlığı verir. Magistratura ikinci pillədir: bakalavr dərəcəsi olan məzunlar üçün daha dərin ixtisaslaşma və tədqiqat hazırlığı. Saytda hər pillənin ixtisasları ayrıca siyahılanır.",
    },
    {
      q: "İxtisasın tədris planını harada görə bilərəm?",
      a: "İxtisasın səhifəsində «Tədris planı» bölməsini açın: bütün fənlər kreditləri, semestrləri və statusları ilə göstərilir. Hər fənnin öz səhifəsində sillabus, mövzu planı və ədəbiyyat siyahısı var.",
    },
    {
      q: "PLO və CLO nədir?",
      a: "Proqram təlim nəticələri (PLO) məzunun proqramı bitirərkən nümayiş etdirməli olduğu bilik və bacarıqlardır. Fənn təlim nəticələri (CLO) isə hər fənnin sonunda gözlənilən nəticələrdir. CLO↔PLO matrisi fənnin hansı proqram nəticəsinə töhfə verdiyini göstərir.",
    },
    {
      q: "Məlumatlar hansı dillərdədir?",
      a: "Sayt Azərbaycan və ingilis dillərindədir — dili yuxarıdakı AZ / EN düyməsi ilə dəyişə bilərsiniz. İngilis dilinə hələ tərcümə olunmamış məlumat Azərbaycan dilində göstərilir.",
    },
    {
      q: "Fakültə və kafedraya görə necə baxım?",
      a: "«Fakültələr» bölməsində hər fakültənin kafedralarını, kafedra səhifəsində isə onun bütün ixtisaslarını görəcəksiniz. Kataloqda ixtisasları fakültəyə görə də süzmək olar.",
    },
    {
      q: "Qəbul və digər suallar üçün kimə müraciət edim?",
      a: `Universitetin əlaqə məlumatları «Əlaqə» səhifəsindədir: ${UNIVERSITY.email}, (+994 12) 538-33-83. Qəbul qaydaları barədə ən son məlumat universitetin rəsmi saytında — aztu.edu.az — dərc olunur.`,
    },
  ];
}
