package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefnVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnVersionRepo extends JpaRepository<ActivityDefnVersion,String> {
}
