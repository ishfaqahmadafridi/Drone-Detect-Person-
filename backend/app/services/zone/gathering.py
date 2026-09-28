"""
Gathering Proximity Analyzer: Detects clusters and social groupings within threshold distance.
"""

from typing import List, Tuple, Dict
import numpy as np


def compute_proximity_gatherings(
    detected_persons: List[Dict],
    proximity_threshold_px: int = 120
) -> Tuple[List[Tuple[int, int, float]], List[int]]:
    """
    Computes pairwise Euclidean distances between detected person centroids
    and identifies clustered individuals.
    """
    gatherings: List[Tuple[int, int, float]] = []
    clustered_ids: List[int] = []
    n = len(detected_persons)
    if n < 2:
        return gatherings, clustered_ids

    for i in range(n):
        for j in range(i + 1, n):
            p1 = detected_persons[i]
            p2 = detected_persons[j]
            
            c1 = p1['center']
            c2 = p2['center']
            dist = float(np.hypot(c1[0] - c2[0], c1[1] - c2[1]))
            
            if dist <= proximity_threshold_px:
                gatherings.append((p1['id'], p2['id'], dist))
                if p1['id'] not in clustered_ids:
                    clustered_ids.append(p1['id'])
                if p2['id'] not in clustered_ids:
                    clustered_ids.append(p2['id'])

    return gatherings, clustered_ids
