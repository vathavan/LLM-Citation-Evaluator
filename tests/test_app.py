import unittest
from app import CASES, INDEX, simulate_prompt

class PrototypeTests(unittest.TestCase):
    def test_all_cases_have_valid_answer(self):
        for case in CASES:
            ids = [claim['id'] for claim in case['claims']]
            self.assertIn(case['correct_claim_id'], ids)
            self.assertEqual(len(ids), len(set(ids)))
            self.assertEqual(set(ids), {source['claim_id'] for source in case['sources']})

    def test_simulated_coach_uses_student_reasoning(self):
        case = INDEX['photosynthesis']
        self.assertIn('carbon dioxide', simulate_prompt(case, 'I believe carbon dioxide supplies all oxygen').lower())
        self.assertIn('water', simulate_prompt(case, 'What about water molecules?').lower())

    def test_empty_match_uses_default_prompt(self):
        self.assertEqual(simulate_prompt(INDEX['seasons'], 'not really sure'), INDEX['seasons']['default_prompt'])

if __name__ == '__main__':
    unittest.main()
