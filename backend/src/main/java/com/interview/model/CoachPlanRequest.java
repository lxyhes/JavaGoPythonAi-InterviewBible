package com.interview.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoachPlanRequest {

    private String category;
    private String heatLevel;
    private String nextAction;

    private int level;
    private int streakDays;
    private int reviewedToday;
    private int dailyGoalTarget;
    private int weakCount;
    private int dueCount;
    private int unlockedAchievements;
}
