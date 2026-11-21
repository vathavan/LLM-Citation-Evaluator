
import unittest
from app import CASES, INDEX


class PrototypeTests(unittest.TestCase):

    def test_cases_exist(self):
        """Check that academic cases are available."""
        self.assertGreater(len(CASES), 0)

    def test_all_cases_have_valid_answer(self):
        """Check that each correct answer matches an existing claim."""
        for case in CASES:
            with self.subTest(case=case["id"]):
                ids = [claim["id"] for claim in case["claims"]]

                self.assertIn(case["correct_claim_id"], ids)
                self.assertEqual(len(ids), len(set(ids)))

                self.assertEqual(
                    set(ids),
                    {source["claim_id"] for source in case["sources"]}
                )

    def test_case_ids_are_unique(self):
        """Check that every academic case has a unique ID."""
        ids = [case["id"] for case in CASES]
        self.assertEqual(len(ids), len(set(ids)))

    def test_index_contains_all_cases(self):
        """Check that each case can be retrieved using its ID."""
        for case in CASES:
            with self.subTest(case=case["id"]):
                self.assertIn(case["id"], INDEX)
                self.assertEqual(INDEX[case["id"]], case)

    def test_claims_have_content(self):
        """Check that every claim has non-empty text."""
        for case in CASES:
            for claim in case["claims"]:
                with self.subTest(
                    case=case["id"],
                    claim=claim["id"]
                ):
                    self.assertTrue(claim.get("text", "").strip())

    def test_sources_have_valid_claim_ids(self):
        """Check that sources reference valid claims."""
        for case in CASES:
            claim_ids = {
                claim["id"] for claim in case["claims"]
            }

            for source in case["sources"]:
                with self.subTest(case=case["id"]):
                    self.assertIn(
                        source["claim_id"],
                        claim_ids
                    )


if __name__ == "__main__":
    unittest.main()
