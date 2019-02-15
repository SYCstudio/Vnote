# [USACO17DEC]Standing Out from the Herd
[BZOJ5137 Luogu4081]

Just like humans, cows often appreciate feeling they are unique in some way. Since Farmer John's cows all come from the same breed and look quite similar, they want to measure uniqueness in their names.  
Each cow's name has some number of substrings. For example, "amy" has substrings {a, m, y, am, my, amy}, and "tommy" would have the following substrings: {t, o, m, y, to, om, mm, my, tom, omm, mmy, tomm, ommy, tommy}.  
A cow name has a "uniqueness factor" which is the number of substrings of that name not shared with any other cow. For example, If amy was in a herd by herself, her uniqueness factor would be 6. If tommy was in a herd by himself, his uniqueness factor would be 14. If they were in a herd together, however, amy's uniqueness factor would be 3 and tommy's would be 11.  
Given a herd of cows, please determine each cow's uniqueness factor.  
定义一个字符串的「独特值」为只属于该字符串的本质不同的非空子串的个数。如 "amy" 与 “tommy” 两个串，只属于 "amy" 的本质不同的子串为 "a" "am" "amy" 共 3 个。只属于 "tommy" 的本质不同的子串为 "t" "to" "tom" "tomm" "tommy" "o" "om" "omm" "ommy" "mm" "mmy" 共 11 个。 所以 "amy" 的「独特值」为 3 ，"tommy" 的「独特值」为 11 。  
给定 N ($N \leq 10^5$) 个字符集为小写英文字母的字符串，所有字符串的长度和小于 $10^5$，求出每个字符串「独特值」。

本质不同的非空子串个数，可以用后缀数组求。现在要求与其它串不重复的本质不同的个数，把所有串连起来，求后缀数组后，每一个串一定是被分成若干个连续区间，那么在区间内部，直接按照单独的本质不同子串计算，两个串交界的地方，则分别对两个串减去重叠的部分。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=402000;
const int maxBit=20;
const int inf=2147483647;

int n,L=0;
char Input[maxN];
int str[maxN];
int Belong[maxN],Len[maxN],St[maxN],lst[maxN];
int CntA[maxN],CntB[maxN],A[maxN],B[maxN];
int SSA[maxN],SA[maxN],Rank[maxN],Height[maxN];
int Ans[maxN];

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++){
		scanf("%s",Input+1);
		int len=strlen(Input+1);
		for (int j=1;j<=len;j++)
			str[++L]=Input[j]-'a'+1,Belong[L]=i,Len[L]=len-j+1;
		if (i!=n) str[++L]='z'-'a'+1+i;
	}

	for (int i=1;i<=L;i++) CntA[str[i]]++;
	for (int i=1;i<maxN;i++) CntA[i]+=CntA[i-1];
	for (int i=L;i>=1;i--) SA[CntA[str[i]]--]=i;
	Rank[SA[1]]=1;
	for (int i=2;i<=L;i++){
		Rank[SA[i]]=Rank[SA[i-1]];
		if (str[SA[i]]!=str[SA[i-1]]) Rank[SA[i]]++; 
	}
	for (int i=1;Rank[SA[L]]!=L;i<<=1){
		mem(CntA,0);mem(CntB,0);
		for (int j=1;j<=L;j++){
			CntA[A[j]=Rank[j]]++;
			CntB[B[j]=((j+i<=L)?(Rank[j+i]):(0))]++;
		}
		for (int j=1;j<maxN;j++) CntA[j]+=CntA[j-1],CntB[j]+=CntB[j-1];
		for (int j=L;j>=1;j--) SSA[CntB[B[j]]--]=j;
		for (int j=L;j>=1;j--) SA[CntA[A[SSA[j]]]--]=SSA[j];
		Rank[SA[1]]=1;
		for (int j=2;j<=L;j++){
			Rank[SA[j]]=Rank[SA[j-1]];
			if ((A[SA[j]]!=A[SA[j-1]])||(B[SA[j]]!=B[SA[j-1]])) Rank[SA[j]]++;
		}
	}

	for (int i=1,j=0;i<=L;i++){
		while (str[i+j]==str[SA[Rank[i]-1]+j]) j++;
		Height[Rank[i]]=j;
		if (j) j--;
	}

	for (int i=1,mn=0;i<=L;i++){
		if (Belong[SA[i]]==0) break;
		mn=min(mn,Height[i]);
		int a=Belong[SA[i-1]],b=Belong[SA[i]];
		if (a!=b){
			Ans[a]=Ans[a]-Height[i]+mn;
			Ans[b]=Ans[b]-Height[i]+Len[SA[i]];mn=Height[i];
		}
		else Ans[b]=Ans[b]+Len[SA[i]]-Height[i];
	}

	for (int i=1;i<=n;i++) printf("%d\n",Ans[i]);return 0;
}
```