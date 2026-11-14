import pytest

from app.db.syncer import infer_view_mode


@pytest.mark.parametrize(
    ("filename", "expected"),
    [
        ("aerial_syn_1794599367167.jpg", "aerial"),  # prefix token, previously mislabelled ground
        ("alert_multi_person_aerial_20261114_1.jpg", "aerial"),
        ("alert_intrusion_ground_20261114_2.jpg", "ground"),
        ("manual_ground_3.jpg", "ground"),
        ("alert_multi_person_4.jpg", "ground"),  # no perspective token falls back to ground
        ("aerialist_5.jpg", "ground"),  # a substring is not a token
    ],
)
def test_infer_view_mode_matches_whole_tokens(filename, expected):
    assert infer_view_mode(filename) == expected
